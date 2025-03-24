import { OrbisDB } from "@useorbis/db-sdk";
import { OrbisKeyDidAuth } from "@useorbis/db-sdk/auth";

export const users = {
  name: "users",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "list",
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      image: {
        type: "string",
      },
      name: {
        type: "string",
      },
      username: {
        type: "string",
      },
      verified: {
        type: "boolean",
      },
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} ;

export const notifications = {
  name: "notifications",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "list",
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      reader_did: {
        type: "string",
      },
      posts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            stream_id: {
              type: "string",
            },
            author_username: {
              type: "string",
            },
            author_did: {
              type: "string",
            },
            title: {
              type: "string",
            },
            preview: {
              type: "string",
            },
          },
          additionalProperties: false,
        },
      },
      comments: {
        type: "array",
        items: {
          type: "object",
          properties: {
            stream_id: {
              type: "string",
            },
            author_username: {
              type: "string",
            },
            author_did: {
              type: "string",
            },
            preview: {
              type: "string",
            },
          },
          additionalProperties: false,
        },
      },
      status: {
        type: "string",
      },
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} ;

export const subscriptions = {
  name: "subscriptions",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "list",
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      author_did: {
        type: "string",
      },
      reader_did: {
        type: "string",
      },
      subscribed: {
        type: "boolean",
      },
      post_notifications: {
        type: "boolean",
      },
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} ;

export const categories = {
  name: "categories",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "list",
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      name: {
        type: "string",
      },
      description: {
        type: "string",
      },
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} ;

export const categorySuggestions = {
  name: "category_suggestions",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "list",
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      name: {
        type: "string",
      },
      description: {
        type: "string",
      },
      status: {
        type: "string",
      },
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} ;

export const tags = {
  name: "tags",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "list",
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      name: {
        type: "string",
      },
      description: {
        type: "string",
      },
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} ;

export const posts = {
  name: "posts",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "list",
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      slug: {
        type: "string",
      },
      author_username: {
        type: "string",
      },
      preview: {
        type: "string",
      },
      title: {
        type: "string",
      },
      body: {
        type: "string",
      },
      category: {
        type: "string",
      },
      tag_ids: {
        type: "array",
        items: {
          type: "string",
        },
      },
      status: {
        type: "string",
      },
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
};

export const comments = {
  name: "comments",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "list",
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      author_username: {
        type: "string",
      },
      body: {
        type: "string",
      },
      preview: {
        type: "string",
      },
      post_id: {
        type: "string",
      },
      parent_ids: {
        type: "string",
      },
      status: {
        type: "string",
      },
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
};

export const reactions = {
  name: "reactions",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "set",
    fields: ['content_id'],
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      user_id: {
        type: "string",
      },
      content_id: {
        type: "string",
      },
      model: {
        type: "string",
      },
      type: {
        type: "string",
      },
      data: {
        type: "string",
      },
    },
    required: ['content_id'],
    additionalProperties: false,
  },
};

const schemas = {
  users,
  subscriptions,
  notifications,
  tags,
  categories,
  categorySuggestions,
  posts,
  comments,
  reactions,
};

export default schemas;


const db = new OrbisDB({
  ceramic: {
    gateway: "https://ceramic-orbisdb-mainnet-direct.hirenodes.io/",
  },
  nodes: [
    {
      gateway: "https://studio.useorbis.com",
    },
  ],
});


const run = async () => {
  const db = new OrbisDB({
    ceramic: {
      gateway: "https://ceramic-orbisdb-mainnet-direct.hirenodes.io/",
    },
    nodes: [
      {
        gateway: "https://studio.useorbis.com",
        env: "did:pkh:eip155:1:0xf608f37c8ce6cc90033258000b0d03b00f87a589",
      },
    ],
  });
  // const byteArray = JSON.parse("[2, 19, 140, 10, 27, 6, 144, 208, 186, 130, 7, 81, 255, 224, 201, 19, 207, 160, 223, 216, 32, 70, 225, 159, 49, 14, 153, 92, 242, 94, 41, 241]");

  const key = "980e1d5aca0c3a790193fb84d5e8b3b6d228c3781e917f73946afc46a382bb06"
  // convert key to byte array in the same way as byteArray
  const  byteArray = key.match(/.{1,2}/g).map(byte => parseInt(byte, 16));

  console.log(byteArray);
  // Step 2: Convert to Uint8Array
  const uint8Array = new Uint8Array(byteArray);
  const auth = await OrbisKeyDidAuth.fromSeed(uint8Array);
  await db.connectUser({ auth });
  console.log(db.ceramic.did)

  // // // Authenticate the user
  // // await db.connectUser({ auth });
  // // const modelsToDeploy = Object.values(schemas);
  // for (const model of modelsToDeploy) {
   
  //     const stream = await db.ceramic.createModel(model);
  // console.log(`Deployed model ${model.name} with stream ID: ${stream.id}`);
    

  //   } 
  }

run();
