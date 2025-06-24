# AO MCP Server

An MCP server for interacting with the AO blockchain network.

## Available Tools

### `ao:createToken`
Creates a new token on the AO blockchain.
- Set token name, ticker, supply, decimals, logo, and minting parameters

### `ao:transfer`
Transfer tokens between addresses.
- Send tokens from your address to another public key

### `ao:balance`
Check token balance for a specific address.
- Get the token balance for any public key

### `ao:balances`
Get all token holder balances.
- See all addresses that hold a specific token and their balances

### `ao:info`
Get token information and metadata.
- Retrieve details about a token (name, ticker, supply, etc.)

### `ao:upload`
Upload files to Arweave and get content hash.
- Upload images or files to Arweave to use as token logos or other purposes

### `ao:getServerInfo`
Get server public key and available tokens.
- Returns your server's public key and list of available tokens (AO, wAR, etc.)

## Notes
- All numeric values must be passed as strings
- Token quantities use the smallest denomination (account for decimal places)
- Use `ao:upload` first to get logo hashes for token creation

## Development

To get started, clone the repository and install the dependencies.

```bash
git clone https://github.com/ALLiDoizCode/Permamind.git
npm install
npm run dev
```

### Start the server

If you simply want to start the server, you can use the `start` script.

If you did not provide .env with a SEED_PHRASE the server will create one but it will not presist through restarts

```bash
npm run start
```

However, you can also interact with the server using the `dev` script.

```bash
npm run dev
```
Depending on what AO env you are using you will need to provide your server with AO and Arweave tokens.
To do this simply ask the server for its public key and transfer it some tokens.

The default permaweb env is using the Marshal testnet https://x.com/Marshal_AO so there is currently **NO** cost for storing memories