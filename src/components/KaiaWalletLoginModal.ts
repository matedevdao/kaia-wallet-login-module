import { el, msg } from "@commonmodule/app";
import {
  Button,
  ConfirmDialog,
  InfoAlert,
  StructuredModal,
} from "@commonmodule/app-components";
import { KaiaWalletButtonGroup } from "kaia-wallet-module";
import WalletForKaiaConnector from "kaia-wallet-module/lib/wallet-connectors/WalletForKaiaConnector.js";
import { createSiweMessage } from "viem/siwe";
import WalletLoginConfig from "../KaiaWalletLoginConfig.js";

interface LoginResult {
  walletId: string;
  walletAddress: `0x${string}`;
  token: string;
}

export default class KaiaWalletLoginModal extends StructuredModal {
  private resolveLogin?: (result: LoginResult) => void;
  private rejectLogin?: (reason: Error) => void;

  constructor() {
    super(".kaia-wallet-login-modal", false);

    this.appendToHeader(el("h1", "Login with Crypto Wallet"));
    this.appendToMain(
      new KaiaWalletButtonGroup(
        "Login",
        (walletConnector) => this.handleLogin(walletConnector),
      ),
    );
    this.appendToFooter(
      new Button(".cancel", {
        title: "Cancel",
        onClick: () => this.remove(),
      }),
    );

    this.on(
      "remove",
      () => this.rejectLogin?.(new Error("Login canceled by user")),
    );
  }

  private async handleLogin(walletConnector: WalletForKaiaConnector) {
    const walletAddress = await walletConnector.connect();
    if (!walletAddress) throw new Error("No accounts found");

    const { nonce, issuedAt } = await WalletLoginConfig.supabaseConnector
      .callEdgeFunction<{ nonce: string; issuedAt: string }>(
        "generate-wallet-login-nonce",
        {
          walletAddress,
          domain: window.location.host,
          uri: window.location.origin,
        },
      );

    await new ConfirmDialog(".kaia-sign-message", {
      title: msg("kaia_sign_message_dialog.title"),
      message: [
        msg("kaia_sign_message_dialog.message"),
        new InfoAlert(msg("kaia_sign_message_dialog.info_alert")),
      ],
      confirmButtonTitle: msg("kaia_sign_message_dialog.button.confirm"),
    }).waitForConfirmation();

    const message = createSiweMessage({
      domain: window.location.host,
      address: walletAddress,
      statement: WalletLoginConfig.messageForWalletLogin,
      uri: window.location.origin,
      version: "1",
      chainId: 1,
      nonce,
      issuedAt: new Date(issuedAt),
    });

    const signedMessage = await walletConnector.signMessage(
      walletAddress,
      message,
    );

    const token = await WalletLoginConfig.supabaseConnector.callEdgeFunction<
      string
    >("wallet-login", { walletAddress, signedMessage });

    await WalletLoginConfig.executeAfterLogin(token);

    this.resolveLogin?.({
      walletId: walletConnector.walletId,
      walletAddress,
      token,
    });

    this.rejectLogin = undefined;
    this.remove();
  }

  public async waitForLogin(): Promise<LoginResult> {
    return new Promise((resolve, reject) => {
      this.resolveLogin = resolve;
      this.rejectLogin = reject;
    });
  }
}
