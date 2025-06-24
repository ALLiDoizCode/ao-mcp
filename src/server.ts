import { FastMCP } from "fastmcp";
import { z } from "zod";

import { add } from "./add.js";

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
    return String(add(args.a, args.b));
  },
  name: "transfer",
  parameters: z.object({
    recipient: z.number().describe("The public key that will recieve the tokens"),
    token: z.number().describe("The address of the token process"),
    qaunity: z.number().describe("the qaunity of tokens to send. Must be denoted in the smallest amount. For example if the token is denoted with 10 decimals and you want to send 1 token the qaunity would be 1 followed by 10 zeros"),
  }),
});

server.start({
  transportType: "stdio",
});
