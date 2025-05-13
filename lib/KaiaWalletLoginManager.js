import { AuthTokenManager, msg } from "@commonmodule/app";
import { AppCompConfig, ConfirmDialog } from "@commonmodule/app-components";
import { KaiaWalletSessionManager } from "kaia-wallet-module";
import KaiaWalletLoginModal from "./components/KaiaWalletLoginModal.js";
import KaiaWalletAPIService from "./KaiaWalletAPIService.js";
class KaiaWalletLoginManager extends AuthTokenManager {
    getLoggedInWallet() {
        return this.store.get("loggedInWallet");
    }
    getLoggedInAddress() {
        return this.store.get("loggedInAddress");
    }
    getLoggedInUser() {
        return this.getLoggedInAddress();
    }
    isLoggedIn() {
        return !!this.token && !!this.getLoggedInWallet() &&
            !!this.getLoggedInAddress();
    }
    constructor() {
        super("kaia-wallet-login-manager");
    }
    async login() {
        this.logout();
        const { walletId, walletAddress, token } = await new KaiaWalletLoginModal()
            .waitForLogin();
        KaiaWalletSessionManager.setConnectedWalletInfo(walletId, walletAddress);
        const currentIsLoggedIn = this.isLoggedIn();
        this.token = token;
        this.store.setPermanent("loggedInWallet", walletId);
        this.store.setPermanent("loggedInAddress", walletAddress);
        if (currentIsLoggedIn !== this.isLoggedIn()) {
            this.emit("loginStatusChanged", this.isLoggedIn());
        }
        return walletAddress;
    }
    logout() {
        KaiaWalletSessionManager.disconnect();
        const currentIsLoggedIn = this.isLoggedIn();
        if (currentIsLoggedIn)
            KaiaWalletAPIService.walletLogout();
        this.token = undefined;
        this.store.remove("loggedInWallet");
        this.store.remove("loggedInAddress");
        if (currentIsLoggedIn !== this.isLoggedIn()) {
            this.emit("loginStatusChanged", this.isLoggedIn());
        }
    }
    async writeContract(parameters) {
        if (!this.getLoggedInAddress() || !this.getLoggedInWallet()) {
            this.showLoginDialog();
            throw new Error("Not logged in");
        }
        if (KaiaWalletSessionManager.getConnectedAddress() &&
            KaiaWalletSessionManager.getConnectedAddress() !==
                this.getLoggedInAddress()) {
            this.showWalletMismatchDialog();
            throw new Error("Wallet address mismatch");
        }
        await KaiaWalletSessionManager.writeContract(parameters);
    }
    showLoginDialog() {
        new ConfirmDialog(".login-kaia-wallet", {
            icon: new AppCompConfig.WarningIcon(),
            title: msg("login_kaia_wallet_modal.title"),
            message: msg("login_kaia_wallet_modal.message"),
            confirmButtonTitle: msg("login_kaia_wallet_modal.button.confirm"),
            onConfirm: () => {
                this.login();
            },
        });
    }
    showWalletMismatchDialog() {
        const currentWalletAddress = KaiaWalletSessionManager.getConnectedAddress();
        const requiredWalletAddress = this.getLoggedInAddress();
        new ConfirmDialog(".kaia-wallet-mismatch", {
            icon: new AppCompConfig.WarningIcon(),
            title: msg("kaia_wallet_mismatch_dialog.title"),
            message: msg("kaia_wallet_mismatch_dialog.message", {
                currentAddress: currentWalletAddress ?? "Unknown",
                requiredAddress: requiredWalletAddress,
            }),
            confirmButtonTitle: msg("kaia_wallet_mismatch_dialog.button.confirm"),
            onConfirm: () => {
                this.login();
            },
        });
    }
}
export default new KaiaWalletLoginManager();
//# sourceMappingURL=KaiaWalletLoginManager.js.map