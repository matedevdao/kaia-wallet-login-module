import WalletLoginConfig from "./WalletLoginConfig.js";
import WalletLoginManager from "./WalletLoginManager.js";
class WalletAPIService {
    async generateWalletLoginNonce(walletAddress) {
        const response = await fetch(`${WalletLoginConfig.apiBaseURL}/generate-wallet-login-nonce`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${WalletLoginManager.token}`,
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
    async walletLogin(walletAddress, signedMessage) {
        const response = await fetch(`${WalletLoginConfig.apiBaseURL}/wallet-login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${WalletLoginManager.token}`,
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
export default new WalletAPIService();
//# sourceMappingURL=WalletAPIService.js.map