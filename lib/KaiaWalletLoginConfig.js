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
    _apiBaseURL;
    get apiBaseURL() {
        if (!this._apiBaseURL)
            throw new Error("API base URL is not set");
        return this._apiBaseURL;
    }
    set apiBaseURL(url) {
        this._apiBaseURL = url;
    }
    init(options) {
        this.apiBaseURL = options.apiBaseURL;
        KaiaWalletModuleConfig.init(options);
    }
}
export default new KaiaWalletLoginConfig();
//# sourceMappingURL=KaiaWalletLoginConfig.js.map