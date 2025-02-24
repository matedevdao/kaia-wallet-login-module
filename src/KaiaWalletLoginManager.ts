import { msg } from "@common-module/app";
import { AppCompConfig, ConfirmDialog } from "@common-module/app-components";
import { AuthTokenManager } from "@common-module/supabase";
import { Config, WriteContractParameters } from "@wagmi/core";
import { KaiaWalletSessionManager } from "kaia-wallet-module";
import type { Abi, ContractFunctionArgs, ContractFunctionName } from "viem";
import KaiaWalletLoginModal from "./components/KaiaWalletLoginModal.js";

class KaiaWalletLoginManager extends AuthTokenManager<{
  loginStatusChanged: (loggedIn: boolean) => void;
}> {
  public getLoggedInWallet() {
    return this.store.get<string>("loggedInWallet");
  }
  public getLoggedInAddress() {
    return this.store.get<`0x${string}`>("loggedInAddress");
  }
  public getLoggedInUser() {
    return this.getLoggedInAddress();
  }
  public isLoggedIn() {
    return !!this.token && !!this.getLoggedInWallet() &&
      !!this.getLoggedInAddress();
  }

  constructor() {
    super("kaia-wallet-login-manager");
  }

  public async login() {
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

  public logout() {
    KaiaWalletSessionManager.disconnect();

    const currentIsLoggedIn = this.isLoggedIn();

    this.token = undefined;
    this.store.remove("loggedInWallet");
    this.store.remove("loggedInAddress");

    if (currentIsLoggedIn !== this.isLoggedIn()) {
      this.emit("loginStatusChanged", this.isLoggedIn());
    }
  }

  public async writeContract<
    const abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
    args extends ContractFunctionArgs<
      abi,
      "nonpayable" | "payable",
      functionName
    >,
    chainId extends Config["chains"][number]["id"],
  >(
    parameters: WriteContractParameters<
      abi,
      functionName,
      args,
      Config,
      chainId
    >,
  ): Promise<void> {
    if (!this.getLoggedInAddress() || !this.getLoggedInWallet()) {
      this.showLoginDialog();
      throw new Error("Not logged in");
    }

    if (
      KaiaWalletSessionManager.getConnectedAddress() &&
      KaiaWalletSessionManager.getConnectedAddress() !==
        this.getLoggedInAddress()
    ) {
      this.showWalletMismatchDialog();
      throw new Error("Wallet address mismatch");
    }

    await KaiaWalletSessionManager.writeContract(parameters as any);
  }

  private showLoginDialog() {
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

  private showWalletMismatchDialog() {
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
