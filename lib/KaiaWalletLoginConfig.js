import { KaiaWalletModuleConfig, } from "kaia-wallet-module";
class KaiaWalletLoginConfig {
    messageForWalletLogin = "Login with Crypto Wallet";
    executeAfterLogin = async (token) => { };
    _supabaesConnector;
    get supabaseConnector() {
        if (!this._supabaesConnector)
            throw new Error("Supabase connector not set");
        return this._supabaesConnector;
    }
    set supabaseConnector(connector) {
        this._supabaesConnector = connector;
    }
    init(options) {
        this.supabaseConnector = options.supabaseConnector;
        KaiaWalletModuleConfig.init(options);
    }
}
export default new KaiaWalletLoginConfig();
//# sourceMappingURL=KaiaWalletLoginConfig.js.map