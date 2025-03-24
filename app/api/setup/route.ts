import { NextResponse } from "next/server";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Pool } from 'pg';

export async function POST() {

  const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING
   });
  // Configure unified loader for all file types
  const loader = new DirectoryLoader("./documents", {
    ".txt": (path) => new TextLoader(path),
    ".mdx": (path) => new TextLoader(path),
    ".pdf": (path) => new PDFLoader(path),
    ".tsx": (path) => new TextLoader(path),
    ".rs": (path) => new TextLoader(path)
  });

  const docs = await loader.load();
  const embeddings = new OpenAIEmbeddings();
  
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: ["\n\n", "\n", " ", ""]
  });

  for (const doc of docs) {
    console.log(`Processing document: ${doc.metadata.source}`);
    const txtPath = doc.metadata.source;
    const text = doc.pageContent;

    const chunks = await textSplitter.createDocuments([text]);
    console.log(`Text split into ${chunks.length} chunks`);

    const embeddingsArrays = await embeddings.embedDocuments(
      chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
    );

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

      const res = await pool.query(
        'INSERT INTO code_embeddings (content, file_path, embedding) VALUES ($1, $2, $3::vector)',
        [
          chunk.pageContent,
          txtPath,
          `[${vector.values.join(',')}]` // Format as array string
        ]
      );
      console.log(res.rows[0], 'inserted from ', txtPath, ":", chunk.pageContent.slice);
      await new Promise((resolve) => setTimeout(resolve, 100));
      // Add your Postgres insertion logic here
    }
    console.log(`Postgres index updated with ${chunks.length} vectors`);
  }

  return NextResponse.json({
    data: "successfully created index and loaded data into OrbisDB...",
  });
}