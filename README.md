# OrbisDB, Lit Protocol, and Langchain Starter

This is a basic starter project for building with the following tools and APIs:

- Next.js
- LangchainJS
- GPT3
- OrbisDB
- Lit Protocol

### What we're building

We are building an app that takes text (text files), embeds them into vectors, stores them into OrbisDB, and allows semantic searching of the data.

We've also enabled data privacy using Lit Protocol to encrypt the corresponding text for each embedding, and programmatically decrypt based on specified access control conditions.

## Running the app

In this section I will walk you through how to deploy and run this app.

### Prerequisites

To run this app, you need the following:

1. An [OpenAI](https://platform.openai.com/) API key
2. A modified [OrbisDB] instance (outlined below)
3. Docker
4. A [Lit](https://www.litprotocol.com/) token ID (also shown below)

## Initial Setup

To run the app locally, follow these steps:

1. Clone this repo and install the dependencies

```sh
git clone https://github.com/ceramicstudio/orbis-lit-langchain
cd orbis-lit-langchain
yarn install
```

2. In a separate terminal, clone this modified version of OrbisDB and install the dependencies

```sh
git clone https://github.com/mzkrasner/orbisdb
cd orbisdb
npm install
```

3. In your orbisdb terminal, start the database process

```sh
# Ensure that you have your Docker Daemon running in the background first
npm run dev
```

Your OrbisDB instance will need to initially be configured using the GUI running on `localhost:7008`. Navigate to this address in your browser and follow these steps:

a. For "Ceramic node URL" enter the following value: `https://ceramic-orbisdb-mainnet-direct.hirenodes.io/`

This is the default public Ceramic node that the hosted Orbis Studio uses. We will leverage this to avoid the setup of a local Ceramic node

b. For "Ceramic Seed" simply click "generate a new one" and go to the next page

c. For "Database configuration" enter the following:

```sh
User=postgres
Database=postgres
Password=postgres
Host=localhost
Port=5432
```

These are the default configurations your Docker image is using. Entering them here enables you to configure your OrbisDB instance to index Ceramic stream data using your dockerized Postgres instance.

Go to the next page

d. Click next on the presets page (do not select anything)

e. Connect with your Metamask account and click "Get started". Keep the Orbis Studio UI in your browser as we will navigate back to it later

4. Go to your `orbis-lit-langchain` terminal and copy the example env file

```sh
cp .env.example.local .env.local
```

5. Navigate to your browser running the OrbisDB UI and create a new context. You can call this anything you want. Once saved, click into your new context and copy the value prefixed with "k" into your `.env.local` file

```sh
CONTEXT_ID="<your-context-id>"
```

Contexts allow developers to organize their data across different applications or projects. When this application uses the Orbis SDK to write embeddings, it will leverage this context when making the write request

6. Next, we will create an OrbisDB seed to self-authenticate onto the Ceramic Network using the Orbis SDK

```sh
yarn gen-seed
```

This is the seed the Orbis SDK will use to self-authenticate your OrbisDB client onto the Ceramic Network in order to perform writes.

Copy only the array of numbers into your `.env.local` file

```sh
# enter as a string like "[2, 19, 140, 10...]"
ORBIS_SEED="your-array-here"
```

Make sure the final number in your array does not contain a trailing comma

7. Copy an active and funded OpenAI API key into your `.env.local` file next to `OPENAI_API_KEY`

8. Choose or create a dummy Metamask address and claim Lit Protocol Testnet tokens using that address by visiting `https://chronicle-yellowstone-faucet.getlit.dev/`

9. Navigate to `https://explorer.litprotocol.com/` in your browser and sign in with the same dummy address as the previous step. Once signed in, click "Mint a new PKP". After minting, copy the value under "Token ID" into your `.env.local` file

```sh
LIT_TOKEN_ID="<your-token-id>"
```

10. Grab the private key from your dummy Metamask wallet (used in the two steps above) and enter it into your `.env.local` file

```sh
ETHEREUM_PRIVATE_KEY="<your-private-key>"
```

11. Finally, deploy your OrbisDB data model we will use to create and query via vector search

```sh
yarn deploy-model
```

This create a new "table" in your OrbisDB instance by creating a Ceramic model stream using the model definition found in [scripts/deploy-model.mjs](./scripts/deploy-model.mjs) on line 15.

Copy the value prefixed with "k" into your `.env.local` file

```sh
TABLE_ID="<your-table-id>"
```

## Running the Application

Now that our environment is configured, run the following to start the application from within your `orbis-lit-langchain` terminal

```sh
npm run dev
```

Make sure that OrbisDB is still running in your other terminal.

Navigate to `localhost:3000` in your browser. 

### Create embeddings

This repository contains a small portion of the [Ceramic Developer Docs](https://developers.ceramic.network/) (specifically information on Decentralized Identifiers) that the application will use to create encrypted embeddings. Feel free to replace this with other documentation if you wish

Click on "Create index and embeddings" and observe your terminal logs in both your `orbisdb` and `orbis-lit-langchain` terminals. 

Once finished, your browser console will notify you that the data has been successfully created and loaded into OrbisDB.

### Run a query 

Since the dataset is limited to special knowledge about DIDs, try the following query

`tell me about decentralized identifiers in ceramic`

Since this is knowledge contained in the embeddings we just created, your LLM's response will find these embeddings based on cosine similarity search and use it as context in the response (after decrypting the values). You can observe your terminal's logs to see what decrypted context it's using.

**Ensure that the dummy wallet you spun up contains 0.000001 ETH or more**

## Access control

At the moment, very simple access control conditions are being leveraged based on whether the wallet trying to read the data contains >=0.000001 ETH (found in [utils](./utils.ts))

```typescript
const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain: "ethereum",
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "1000000000000", // 0.000001 ETH
    },
  },
];
```

There is a wide array of access control conditions you can use or create. For more information, visit [Lit's Access Control documentation](https://developer.litprotocol.com/sdk/access-control/intro).