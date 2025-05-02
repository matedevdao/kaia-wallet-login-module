import { el, msg } from "@commonmodule/app";
import { Button, ConfirmDialog, InfoAlert, StructuredModal, } from "@commonmodule/app-components";
import { KaiaWalletButtonGroup } from "kaia-wallet-module";
import { createSiweMessage } from "viem/siwe";
import KaiaWalletAPIService from "../KaiaWalletAPIService.js";
import WalletLoginConfig from "../KaiaWalletLoginConfig.js";
export default class KaiaWalletLoginModal extends StructuredModal {
    resolveLogin;
    rejectLogin;
    constructor() {
        super(".kaia-wallet-login-modal", false);
        this.appendToHeader(el("h1", msg("kaia_wallet_login_modal.title")));
        this.appendToMain(new KaiaWalletButtonGroup(msg("kaia_wallet_login_modal.button.login"), (walletConnector) => this.handleLogin(walletConnector)));
        this.appendToFooter(new Button(".cancel", {
            title: "Cancel",
            onClick: () => this.remove(),
        }));
        this.on("remove", () => this.rejectLogin?.(new Error("Login canceled by user")));
    }
    async handleLogin(walletConnector) {
        const walletAddress = await walletConnector.connect();
        if (!walletAddress)
            throw new Error("No accounts found");
        const { nonce, issuedAt } = await KaiaWalletAPIService
            .generateWalletLoginNonce(walletAddress);
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
        const signedMessage = await walletConnector.signMessage(walletAddress, message);
        const token = await KaiaWalletAPIService.walletLogin(walletAddress, signedMessage);
        await WalletLoginConfig.executeAfterLogin(token);
        this.resolveLogin?.({
            walletId: walletConnector.walletId,
            walletAddress,
            token,
        });
        this.rejectLogin = undefined;
        this.remove();
    }
    async waitForLogin() {
        return new Promise((resolve, reject) => {
            this.resolveLogin = resolve;
            this.rejectLogin = reject;
        });
    }
}
//# sourceMappingURL=KaiaWalletLoginModal.js.map