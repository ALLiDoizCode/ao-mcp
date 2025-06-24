import { FastMCP } from "fastmcp";
import { z } from "zod";
import { generateMnemonic, getKeyFromMnemonic } from "./mnemonic.js"
import Arweave from 'arweave';
import { JWKInterface } from "arweave/node/lib/wallet.js";
import { Tag } from "./models/Tag.js";
import dotenv from 'dotenv';
import { tokenService } from "./services/token.js"
import { Token } from "./models/Token.js";
import { upload } from "./services/uploader.js";

let keyPair: JWKInterface;
let publicKey: string;
let hubId: string;

dotenv.config();

async function init() {
  const arweave = Arweave.init({});
  if (process.env.SEED_PHRASE) {
    keyPair = await getKeyFromMnemonic(process.env.SEED_PHRASE)
  } else {
    keyPair = await arweave.wallets.generate()
  }
  publicKey = await arweave.wallets.jwkToAddress(keyPair)
}

const server = new FastMCP({
  name: "AO",
  version: "1.0.0",
});

server.addTool({
  annotations: {
    openWorldHint: false, // This tool doesn't interact with external systems
    readOnlyHint: true, // This tool doesn't modify anything
    title: "Transfer",
  },
  description: "Transfer tokens to another public key. Call this tool when you need to transfer tokens to another public key",
  execute: async (args) => {
    return await tokenService.transfer(keyPair, args.token, args.recipient, args.qaunity)
  },
  name: "transfer",
  parameters: z.object({
    recipient: z.string().describe("The public key that will recieve the tokens"),
    token: z.string().describe("The address of the token process"),
    qaunity: z.string().describe("the qaunity of tokens to send. Must be denoted in the smallest amount. For example if the token is denoted with 10 decimals and you want to send 1 token the qaunity would be 1 followed by 10 zeros. use the info tool to get the Denomination and the balance tool to ensure the your public key has a sufficient balance"),
  }),
});

server.addTool({
  annotations: {
    openWorldHint: false, // This tool doesn't interact with external systems
    readOnlyHint: true, // This tool doesn't modify anything
    title: "Balance",
  },
  description: "gets the token balance for the recipient. Call this when you want to get the balance for a public key",
  execute: async (args) => {
    return await tokenService.balance(args.token, args.recipient)
  },
  name: "balance",
  parameters: z.object({
    recipient: z.string().describe("The public key whos balance will be checked"),
    token: z.string().describe("The address of the token process"),
  }),
});

server.addTool({
  annotations: {
    openWorldHint: false, // This tool doesn't interact with external systems
    readOnlyHint: true, // This tool doesn't modify anything
    title: "Balances",
  },
  description: "gets the token balance for all holders. Call this when you want to get the balance for all holders",
  execute: async (args) => {
    return await tokenService.balances(args.token)
  },
  name: "balances",
  parameters: z.object({
    token: z.string().describe("The address of the token process"),
  }),
});

server.addTool({
  annotations: {
    openWorldHint: false, // This tool doesn't interact with external systems
    readOnlyHint: true, // This tool doesn't modify anything
    title: "Info",
  },
  description: "gets information about the token. Call this when you want to get the information for the token",
  execute: async (args) => {
    return await tokenService.info(args.token)
  },
  name: "info",
  parameters: z.object({
    token: z.string().describe("The address of the token process"),
  }),
});

server.addTool({
  annotations: {
    openWorldHint: false, // This tool doesn't interact with external systems
    readOnlyHint: true, // This tool doesn't modify anything
    title: "Create Token",
  },
  description: "Creates a token based on the args. Call this when you want to create a token",
  execute: async (args) => {
    let token = await tokenService.create(keyPair, args);
    let explorer = `https://lunar.velocity.cloudnet.marshal.ao/#/explorer/${token}/info`;
    let result = {
      "explorer": explorer,
      "token": token
    }
    return JSON.stringify(result)
  },
  name: "createToken",
  parameters: z.object({
    Denomination: z.string().describe("The token denomination. MUST be a stringified number"),
    TotalSupply: z.string().describe("The total supply of the token. MUST be a stringified number"),
    Name: z.string().describe("The name of the token"),
    Ticker: z.string().describe("The tokens ticker"),
    Logo: z.string().describe("The tokens logo"),
    BuyToken: z.string().describe("The token used to pay for the minting of tokens"),
    MaxMint: z.string().describe("The max amount of tokens to mint. MUST be a stringified number"),
    Multiplier: z.string().describe("The amount of tokens minted for 1 BuyToken. MUST be a stringified number"),
  }),
});

server.addTool({
  annotations: {
    openWorldHint: false, // This tool doesn't interact with external systems
    readOnlyHint: true, // This tool doesn't modify anything
    title: "Upload",
  },
  description: "uploads images and other files and returns the hash. Call this when you want to upload data",
  execute: async (args) => {
    let result = await upload(keyPair, publicKey, args.path)
    return result.hash
  },
  name: "upload",
  parameters: z.object({
    path: z.string().describe("absolute path of the file"),
  }),
});

// Tool to get public key
server.addTool({
  annotations: {
    openWorldHint: false, // This tool doesn't interact with external systems
    readOnlyHint: true, // This tool doesn't modify anything
    title: "Get Server Info",
  },
  description: "gets the public key for the server and a list of crypto currency tokens on the AO blockchain",
  parameters: z.object({}), // Empty object
  execute: async (args) => {
    let response = {
      publicKey: publicKey,
      tokens: {
        AO: "0syT13r0s0tgPmIed95bJnuSqaD29HQNN8D3ElLSrsc",
        wAR: "xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10"
      }
    }
    return JSON.stringify(response);
  },
  name: "getServerInfo"
});

init().then((value) => {
  server.start({
    transportType: "stdio",
  })
})