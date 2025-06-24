import { send, read, createProcess } from "../process.js";
import { Tag } from "../models/Tag.js";
import { JWKInterface } from "arweave/node/lib/wallet.js";
import { Token } from "../models/Token.js";
import { luaModule } from "./token_lua.js";
export interface TokenService {
    transfer: (signer: JWKInterface, processId: string, recipient: string, qaunity: string) => Promise<string>;
    balance: (processId: string, owner: any) => Promise<string>;
    balances: (processId: string) => Promise<string>;
    info: (processId: string) => Promise<string>;
    create: (signer: JWKInterface, token: Token) => Promise<string>;
}

const service = (): TokenService => {
    return {
        transfer: async (signer: JWKInterface, processId: string, recipient: string, qaunity: string): Promise<string> => {
            let actionTag: Tag = {
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

            let tags: Array<Tag> = [actionTag, recipientTag, qaunityTag]

            try {
                await send(signer, processId, tags, null)
                return "success"
            } catch (e) {
                return JSON.stringify(e)
            }
        },
        balance: async (processId: string, publickey: string): Promise<string> => {
            let actionTag: Tag = {
                name: "Action",
                value: "Balance"
            }
            let recipientTag: Tag = {
                name: "Recipient",
                value: publickey
            }
            let tags: Array<Tag> = [actionTag, recipientTag]

            try {
                let result = await read(processId, tags)
                return JSON.stringify(result)
            } catch (e) {
                return JSON.stringify(e)
            }
        },
        balances: async (processId: string): Promise<string> => {
            let actionTag: Tag = {
                name: "Action",
                value: "Balances"
            }
            try {
                let result = await read(processId, [actionTag])
                return JSON.stringify(result)
            } catch (e) {
                return JSON.stringify(e)
            }
        },
        info: async (processId: string): Promise<string> => {
            let actionTag: Tag = {
                name: "Action",
                value: "Info"
            }
            try {
                let result = await read(processId, [actionTag])
                return JSON.stringify(result)
            } catch (e) {
                return JSON.stringify(e)
            }
        },
        create: async (signer: JWKInterface, token: Token): Promise<string> => {
            let actionTag: Tag = {
                name: "Action",
                value: "Init"
            }
            
            let denominationTag: Tag = {
                name: "Denomination",
                value: token.Denomination
            }
            let totalSupplyTag: Tag = {
                name: "TotalSupply",
                value: token.TotalSupply
            }
            
            let nameTag: Tag = {
                name: "Name",
                value: token.Name
            }
            let tickerTag: Tag = {
                name: "Ticker",
                value: token.Ticker
            }
            let logoTag: Tag = {
                name: "Logo",
                value: token.Logo
            }
            
            let buyTokenTag: Tag = {
                name: "BuyToken",
                value: token.BuyToken
            }
            
            let maxMintTag: Tag = {
                name: "MaxMint",
                value: token.MaxMint
            }
            
            let multiplierTag: Tag = {
                name: "Multiplier",
                value: token.Multiplier
            }

            let initTags: Array<Tag> = [
                actionTag,
                denominationTag,
                totalSupplyTag,
                nameTag,
                tickerTag,
                logoTag,
                buyTokenTag,
                maxMintTag,
                multiplierTag
            ]
            try {
                const processId = await createProcess(signer);
                let tags = [{ name: "Action", value: "Eval" }];
                await send(signer, processId, tags, luaModule);
                await send(signer, processId, initTags, null)
                return processId
            } catch (e) {
                return JSON.stringify(e)
            }
        },
    };
};

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


export const tokenService = service();