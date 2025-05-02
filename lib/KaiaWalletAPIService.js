import KaiaWalletLoginConfig from "./KaiaWalletLoginConfig.js";
import KaiaWalletLoginManager from "./KaiaWalletLoginManager.js";
export default class KaiaWalletAPIService {
    static async generateWalletLoginNonce(walletAddress) {
        const response = await fetch(`${KaiaWalletLoginConfig.apiBaseURL}/generate-wallet-login-nonce`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${KaiaWalletLoginManager.token}`,
            },
            body: JSON.stringify({
                walletAddress,
                domain: window.location.host,
                uri: window.location.origin,
            }),
        });
        if (!response.ok) {
            throw new Error("Failed to generate nonce");
        }
        const data = await response.json();
        if (!data.nonce || !data.issuedAt) {
            throw new Error("Invalid response from server");
        }
        return {
            nonce: data.nonce,
            issuedAt: data.issuedAt,
        };
    }
    static async walletLogin(walletAddress, signedMessage) {
        const response = await fetch(`${KaiaWalletLoginConfig.apiBaseURL}/wallet-login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${KaiaWalletLoginManager.token}`,
            },
            body: JSON.stringify({
                walletAddress,
                signedMessage,
            }),
        });
        if (!response.ok) {
            throw new Error("Failed to login");
        }
        const data = await response.json();
        if (!data.token) {
            throw new Error("Invalid response from server");
        }
        return data.token;
    }
}
//# sourceMappingURL=KaiaWalletAPIService.js.map