export default class KaiaWalletAPIService {
    static generateWalletLoginNonce(walletAddress: string): Promise<{
        nonce: string;
        issuedAt: string;
    }>;
    static walletLogin(walletAddress: string, signedMessage: string): Promise<string>;
    static walletLogout(walletAddress: string, token: string): Promise<void>;
}
//# sourceMappingURL=KaiaWalletAPIService.d.ts.map