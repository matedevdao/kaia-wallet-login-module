declare class WalletAPIService {
    generateWalletLoginNonce(walletAddress: string): Promise<{
        nonce: string;
        issuedAt: string;
    }>;
    walletLogin(walletAddress: string, signedMessage: string): Promise<string>;
}
declare const _default: WalletAPIService;
export default _default;
//# sourceMappingURL=WalletAPIService.d.ts.map