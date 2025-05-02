import { IKaiaWalletModuleConfig } from "kaia-wallet-module";
declare class KaiaWalletLoginConfig {
    messageForWalletLogin: string;
    executeAfterLogin: (token: string) => Promise<void>;
    private _apiBaseURL;
    get apiBaseURL(): string;
    set apiBaseURL(url: string);
    init(options: IKaiaWalletModuleConfig & {
        apiBaseURL: string;
    }): void;
}
declare const _default: KaiaWalletLoginConfig;
export default _default;
//# sourceMappingURL=KaiaWalletLoginConfig.d.ts.map