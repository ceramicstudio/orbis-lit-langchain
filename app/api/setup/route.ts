import { NextResponse } from "next/server";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { updateOrbis } from "../../../utils";

export async function POST() {
  const loader = new DirectoryLoader("./documents", {
    ".txt": (path) => new TextLoader(path),
    ".md": (path) => new TextLoader(path),
    ".pdf": (path) => new PDFLoader(path),
  });

  const docs = await loader.load();

  try {
    const { CONTEXT_ID, TABLE_ID } = process.env;
    await updateOrbis(docs, CONTEXT_ID, TABLE_ID);
  } catch (err) {
    console.log("error: ", err);
  }

  return NextResponse.json({
    data: "successfully created index and loaded data into OrbisDB...",
  });
}
