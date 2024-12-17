import { OrbisDB } from "@useorbis/db-sdk";
import { OrbisKeyDidAuth } from "@useorbis/db-sdk/auth";

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

const embeddingModel = {
  version: "2.0",
  name: "EmbeddingModel",
  description: "Embedding model",
  accountRelation: { type: "list" },
  interface: false,
  implements: [],
  schema: {
    type: "object",
    properties: {
      embedding: {
        type: "array",
        items: {
          type: "number",
        },
      },
      content: {
        type: "string",
      },
      contenthash: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
};

const run = async () => {
  const seed = await OrbisKeyDidAuth.generateSeed();

  // Initiate the authenticator using the generated (or persisted) seed
  const auth = await OrbisKeyDidAuth.fromSeed(seed);

  // Authenticate the user
  await db.connectUser({ auth });
  const model = await db.ceramic.createModel(embeddingModel);
  console.log({
    model,
  });
};
run();
