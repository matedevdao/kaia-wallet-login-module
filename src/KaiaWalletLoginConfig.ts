import { I18nMessageManager } from "@commonmodule/app";
import {
  IKaiaWalletModuleConfig,
  KaiaWalletModuleConfig,
} from "kaia-wallet-module";
import messages_en from "../locales/en.yml";
import messages_ko from "../locales/ko.yml";

I18nMessageManager.addMessagesBulk({
  en: messages_en,
  ko: messages_ko,
});

class KaiaWalletLoginConfig {
  public messageForWalletLogin = "Login with Crypto Wallet";
  public executeAfterLogin = async (token: string) => {};

  private _apiBaseURL: string | undefined;
  public get apiBaseURL() {
    if (!this._apiBaseURL) throw new Error("API base URL is not set");
    return this._apiBaseURL;
  }
  public set apiBaseURL(url: string) {
    this._apiBaseURL = url;
  }

  public init(options: IKaiaWalletModuleConfig & { apiBaseURL: string }) {
    this.apiBaseURL = options.apiBaseURL;
    KaiaWalletModuleConfig.init(options);
  }
}

export default new KaiaWalletLoginConfig();
