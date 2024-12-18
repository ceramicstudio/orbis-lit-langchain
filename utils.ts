import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OrbisDB } from "@useorbis/db-sdk";
import { OrbisKeyDidAuth } from "@useorbis/db-sdk/auth";
import axios from "axios";
import { Lit } from "@/lib/litUtils";

export const queryLLM = async (question, context) => {
  if (context.rows.length) {
    const decryptedRows = await Promise.all(
      context.rows.map(async (row) => {
        const lit = new Lit();
        const { ciphertext, dataToEncryptHash } = JSON.parse(row.content);
        const decryptedContent = await lit.decrypt(
          ciphertext,
          dataToEncryptHash
        );
        return decryptedContent;
      })
    );

    // Concatenate the decrypted rows into a single string
    const concatenatedContext = decryptedRows.join(" ");

    // Prepare prompt
    const prompt = `
      Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know. Don't make up an answer.

      Context:
      ${concatenatedContext}

      Question: ${question}

      Helpful Answer:`;

    // Send request to OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // or "gpt-4" based on your API key's availability
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000, // Adjust based on your needs
        temperature: 0.7, // Adjust for creativity vs. determinism
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    if (response.status !== 200) {
      // Log the full response object if the request failed
      console.error("Error response from API:", response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Log the raw response text for debugging
    const text = response.data;

    console.log("API response:", text.choices[0].message.content);

    return text.choices[0].message.content;
  } else {
    // 11. Log that there are no matches, so GPT-3 will not be queried
    console.log("Since there are no matches, GPT-3 will not be queried.");
  }
};

export const updateOrbis = async (docs, context, table) => {
  const lit = new Lit();

  const db = new OrbisDB({
    ceramic: {
      gateway: "https://ceramic-orbisdb-mainnet-direct.hirenodes.io/",
    },
    nodes: [
      {
        gateway: "http://localhost:7008",
      },
    ],
  });
  const seed = new Uint8Array(JSON.parse(process.env.ORBIS_SEED));
  // Initiate the authenticator using the generated (or persisted) seed
  const auth = await OrbisKeyDidAuth.fromSeed(seed);

  // Authenticate the user
  await db.connectUser({ auth });

  for (const doc of docs) {
    console.log(`Processing document: ${doc.metadata.source}`);
    const txtPath = doc.metadata.source;
    const text = doc.pageContent;
    // 4. Create RecursiveCharacterTextSplitter instance
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    console.log("Splitting text into chunks...");
    // 5. Split text into chunks (documents)
    const chunks = await textSplitter.createDocuments([text]);
    console.log(`Text split into ${chunks.length} chunks`);
    console.log(
      `Calling OpenAI's Embedding endpoint documents with ${chunks.length} text chunks ...`
    );
    // 6. Create OpenAI embeddings for documents
    const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
      chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
    );
    console.log("Finished embedding documents");
    console.log(
      `Creating ${chunks.length} vectors array with id, values, and metadata...`
    );
    // 7. Create and upsert vectors in batches of 100
    for (let idx = 0; idx < chunks.length; idx++) {
      const chunk = chunks[idx];
      const vector = {
        id: `${txtPath}_${idx}`,
        values: embeddingsArrays[idx],
        metadata: {
          ...chunk.metadata,
          loc: JSON.stringify(chunk.metadata.loc),
          pageContent: chunk.pageContent,
          txtPath: txtPath,
        },
      };

      const formattedEmbedding = `ARRAY[${vector.values.join(", ")}]::vector`;
      const encryptedContent = await lit.encrypt(vector.metadata.pageContent);
      const encryptedStringified = JSON.stringify(encryptedContent);

      // wait half a second to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
      // first check if the vector already exists
      const query = `SELECT * FROM ${table} WHERE embedding = ${formattedEmbedding}`;
      const res = await db.select().raw(query).run();
      // only insert if the vector does not already exist
      if (!res.rows.length) {
        const createQuery = await db
          .insert(table)
          .value({
            embedding: vector.values,
            content: encryptedStringified,
          })
          .context(context)
          .run();
        console.log(createQuery);
      }
    }
    // 8. Log the number of vectors updated
    console.log(`Orbis index updated with ${chunks.length} vectors`);
  }
};
