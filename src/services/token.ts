import { send, read } from "../process.js";
import { Tag } from "../models/Tag.js";
import { JWKInterface } from "arweave/node/lib/wallet.js";

export interface HubRegistryService {
    transfer: (signer: JWKInterface, processId: string, recipient: string, qaunity: string) => Promise<string>;
    balance: (processId: string, owner: any) => Promise<string>;
    balances: (processId: string) => Promise<string>;
    info: (processId: string) => Promise<string>;
    //create: (signer: JWKInterface, profileData: ProfileCreateData) => Promise<string>;
}

const service = (): HubRegistryService => {
    return {
        transfer: async (signer: JWKInterface, processId: string, recipient: string, qaunity: string): Promise<string> => {
            let ActionTag: Tag = {
                name: "Action",
                value: "Transfer"
            }
            let recipientTag: Tag = {
                name: "Recipient",
                value: recipient
            }
            let qaunityTag: Tag = {
                name: "Quantity",
                value: qaunity
            }

            let tags: Array<Tag> = [ActionTag, recipientTag, qaunityTag]

            try {
                await send(signer, processId, tags, null)
                return "success"
            } catch(e) {
                return JSON.stringify(e)
            }
        },
        balance: async (processId: string, publickey: string): Promise<string> => {
            let ActionTag: Tag = {
                name: "Action",
                value: "Balance"
            }
            let recipientTag: Tag = {
                name: "Recipient",
                value: publickey
            }
            let tags: Array<Tag> = [ActionTag, recipientTag]

            try {
                let result = await read(processId, tags)
                return JSON.stringify(result)
            } catch(e) {
                return JSON.stringify(e)
            }
        },
        balances: async (processId: string): Promise<string> => {
            let ActionTag: Tag = {
                name: "Action",
                value: "Balances"
            }
            try {
                let result = await read(processId, [ActionTag])
                return JSON.stringify(result)
            } catch(e) {
                return JSON.stringify(e)
            }
        },
        info: async (processId: string): Promise<string> => {
            let ActionTag: Tag = {
                name: "Action",
                value: "Info"
            }
             try {
                let result = await read(processId, [ActionTag])
                return JSON.stringify(result)
            } catch(e) {
                return JSON.stringify(e)
            }
        },
    };
};