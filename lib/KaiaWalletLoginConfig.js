import { I18nMessageManager } from "@commonmodule/app";
import { KaiaWalletModuleConfig, } from "kaia-wallet-module";
import messages_en from "../locales/en.yml";
import messages_ko from "../locales/ko.yml";
I18nMessageManager.addMessagesBulk({
    en: messages_en,
    ko: messages_ko,
});
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