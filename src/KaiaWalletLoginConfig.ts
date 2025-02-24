import { SupabaseConnector } from "@common-module/supabase";
import {
  IKaiaWalletModuleConfig,
  KaiaWalletModuleConfig,
} from "kaia-wallet-module";

class KaiaWalletLoginConfig {
  public messageForWalletLogin = "Login with Crypto Wallet";
  public executeAfterLogin = async (token: string) => {};

  private _supabaesConnector: SupabaseConnector | undefined;
  public get supabaseConnector() {
    if (!this._supabaesConnector) throw new Error("Supabase connector not set");
    return this._supabaesConnector;
  }
  public set supabaseConnector(connector: SupabaseConnector) {
    this._supabaesConnector = connector;
  }

  public init(
    options: IKaiaWalletModuleConfig & { supabaseConnector: SupabaseConnector },
  ) {
    this.supabaseConnector = options.supabaseConnector;

    KaiaWalletModuleConfig.init(options);
  }
}

export default new KaiaWalletLoginConfig();
