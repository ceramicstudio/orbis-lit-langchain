import { NextRequest, NextResponse } from "next/server";
import { queryLLM } from "../../../utils";
import { OrbisDB } from "@useorbis/db-sdk";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("body: ", body);
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

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
  });
  console.log("Splitting query into chunks...");
  // 5. Split text into chunks (documents)
  const chunks = await textSplitter.createDocuments([body]);

  const array = await new OpenAIEmbeddings().embedDocuments(
    chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
  );
  const formattedEmbedding = `ARRAY[${array.join(", ")}]::vector`;
  const query = `
        SELECT content, embedding <=> ${formattedEmbedding} AS similarity
        FROM ${process.env.TABLE_ID}
        ORDER BY similarity ASC
        LIMIT 5;
    `;
  const context = await db.select().raw(query).run();
  const res = await queryLLM(body, context);

  return NextResponse.json({
    data: res,
  });
}
