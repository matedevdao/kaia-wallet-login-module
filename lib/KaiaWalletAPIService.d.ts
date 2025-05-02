export default class KaiaWalletAPIService {
    static generateWalletLoginNonce(walletAddress: string): Promise<{
        nonce: string;
        issuedAt: string;
    }>;
    static walletLogin(walletAddress: string, signedMessage: string): Promise<string>;
}
//# sourceMappingURL=KaiaWalletAPIService.d.ts.map