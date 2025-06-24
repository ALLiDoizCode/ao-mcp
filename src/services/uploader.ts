import { ARWEAVE_URL, toUrl } from "../constants.js";
import Arweave from "arweave";
import fs from 'fs/promises';

import mime from 'mime';
// @ts-ignore
export const upload = async (keyPair, address, data, contentType) => {

  let ext = mime.getExtension(contentType);
  // #1 Get the data from the POST request; encoded as base64 string.
  //const b64string = req.body.b64string
  //const buf = Buffer.from(b64string, 'base64');

  // #2 Make a connection to Arweave server; following standard example.
  const arweave = Arweave.init({
    host: ARWEAVE_URL(),
    port: 443,
    protocol: "https",
  });

  // #4 Check out wallet balance. We should probably fail if too low?
  const arweaveWalletBallance = await arweave.wallets.getBalance(address);

  // #5 Core flow: create a transaction, upload and wait for the status!
  let transaction = await arweave.createTransaction({ data: data });
  // let video_transaction = await arweave.createTransaction({data: file});
  // video_transaction.addTag("Content-Type", "video/mp4");
  transaction.addTag('Content-Type', contentType!);
  await arweave.transactions.sign(transaction, keyPair);
  const response = await arweave.transactions.post(transaction);
  const status = await arweave.transactions.getStatus(transaction.id);
  let url = `${toUrl(transaction.id)}?ext=${ext}`;
  return {
    url: url,
    hash: transaction.id,
    ext: ext,
    mimeType: contentType
  };
};

function base64ToArrayBuffer(base64: string) {
  // Remove data URL prefix if present
  const base64Data = base64.split(',')[1] || base64;

  // Create buffer from base64
  const buffer = Buffer.from(base64Data, 'base64');

  // Convert to ArrayBuffer
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}