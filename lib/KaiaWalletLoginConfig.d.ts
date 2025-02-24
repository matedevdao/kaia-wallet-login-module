import { SupabaseConnector } from "@common-module/supabase";
import { IKaiaWalletModuleConfig } from "kaia-wallet-module";
declare class KaiaWalletLoginConfig {
    messageForWalletLogin: string;
    executeAfterLogin: (token: string) => Promise<void>;
    private _supabaesConnector;
    get supabaseConnector(): SupabaseConnector;
    set supabaseConnector(connector: SupabaseConnector);
    init(options: IKaiaWalletModuleConfig & {
        supabaseConnector: SupabaseConnector;
    }): void;
}
declare const _default: KaiaWalletLoginConfig;
export default _default;
//# sourceMappingURL=KaiaWalletLoginConfig.d.ts.map