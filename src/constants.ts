export function MU_URL(): string {
    return "https://mu.velocity.cloudnet.marshal.ao";
}

export function CU_URL(): string {
    return "https://cu.velocity.cloudnet.marshal.ao";
}

export function GATEWAY_URL(): string {
    return "https://gateway.velocity.cloudnet.marshal.ao";
}

export function SCHEDULER(): string {
   return "Tm7v2ddwSr_5UxjmuCmhkMSZpzhtKJkkpLMZK_p6mQU";
}

export function AOS_MODULE(): string {
    return "28gHGe_ARwPfCL7zYD2HB5oGvvP74mbfbHLESNFo55o";
}

export function HUB_REGISTRY_ID(): string {
    return "g_eSbkmD4LzfZtXaCLmeMcLIBQrqxnY-oFQJJNMIn4w";
}

export function WAR_TOKEN(): string {
    return "WPyLgOqELOyN_BoTNdeEMZp5sz3RxDL19IGcs3A9IPc";
}

export function ARWEAVE_URL(): string {
    /*
    case "production": {
            return "arweave.net";
        }
    */
    return "arweave.velocity.cloudnet.marshal.ao";
}

export function toUrl(tx: string) {
    return "https://"+ARWEAVE_URL()+"/"+tx;
}

export const DEFAULT_QUANTITY = "1000000000000000000"
export const DECIMALS = 1000000000000;


export const AR_Token = "xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10"
export const AO_Token = "0syT13r0s0tgPmIed95bJnuSqaD29HQNN8D3ElLSrsc"
export const BazarUCM = "U3TjJAZWJjlWBB4KAXSHKzuky81jtyh0zqH8rUL4Wd0"

export function formatNumber(num: number) {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
    let tier = Math.log10(Math.abs(num)) / 3 | 0;

    if (tier === 0) return num.toString();

    const suffix = suffixes[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;

    return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
}