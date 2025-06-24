import { JWKInterface } from "arweave/node/lib/wallet.js";
import { AOS_MODULE, CU_URL, GATEWAY_URL, MU_URL, SCHEDULER } from "./constants.js";
// @ts-ignore
import { connect, createDataItemSigner, assign } from "@permaweb/aoconnect";


function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


const { result, results, message, spawn, monitor, unmonitor, dryrun } =
// @ts-ignore
    connect({
        MU_URL: MU_URL(),
        CU_URL: CU_URL(),
        GATEWAY_URL: GATEWAY_URL(),
    });

// @ts-ignore
export async function send(signer:JWKInterface, processId, tags, data: string | null) {
    //console.log("data");
    //console.log(data);
    // The only 2 mandatory parameters here are process and signer
    // connect to the extension
    // @ts-ignore
    let _message = {
        /*
    The arweave TXID of the process, this will become the "target".
    This is the process the message is ultimately sent to.
*/
        process: processId,

        // Tags that the process will use as input.
        tags: tags,
        data: "",
        scheduler: SCHEDULER(),
        // A signer function used to build the message "signature"
        // @ts-ignore
        signer: createDataItemSigner(signer),
    };
    if (data) _message.data = data;
    let messageId = await message(_message);
    return await readMessage(messageId, processId);
    //return result
}

// @ts-ignore
export const read = async (processId, tags) => {
    //await sleep(300)
    //console.log("reading data")
    // The only 2 mandatory parameters here are process and signer
    // connect to the extension
    // @ts-ignore
    //console.log(processId)
    //console.log(tags)
    let result = await dryrun({
        /*
    The arweave TXID of the process, this will become the "target".
    This is the process the message is ultimately sent to.
*/
        process: processId,

        // Tags that the process will use as input.
        tags: tags,
        scheduler: SCHEDULER(),
        MU_URL: MU_URL(),
        CU_URL: CU_URL(),
        GATEWAY_URL: GATEWAY_URL(),
    });
    //console.log(result)
    if (result.Messages) {
        let message = result.Messages.pop();
        return message;
    }
    //return result
};

export const createProcess = async (signer:JWKInterface,) => {
    const processId = await spawn({
        // The Arweave TXID of the ao Module
        module: AOS_MODULE(),
        scheduler: SCHEDULER(),
        // @ts-ignore
        signer: createDataItemSigner(signer),
    });
    await sleep(3000);
    return processId;
};

// @ts-ignore
const readMessage = async (messageId: string, processId: string) => {
    let { Messages, Spawns, Output, Error } = await result({
        // the arweave TXID of the message
        message: messageId,
        // the arweave TXID of the process
        process: processId,
    });
    if (Error == undefined) {
        //let message = Messages.pop();
        //let data = JSON.parse(message.Data);
    } else {
        throw Error;
    }
};