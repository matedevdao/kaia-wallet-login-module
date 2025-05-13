import { AuthTokenManager } from "@commonmodule/app";
import { Config, WriteContractParameters } from "@wagmi/core";
import type { Abi, ContractFunctionArgs, ContractFunctionName } from "viem";
declare class KaiaWalletLoginManager extends AuthTokenManager<{
    loginStatusChanged: (loggedIn: boolean) => void;
}> {
    getLoggedInWallet(): string | undefined;
    getLoggedInAddress(): `0x${string}` | undefined;
    getLoggedInUser(): `0x${string}` | undefined;
    isLoggedIn(): boolean;
    constructor();
    login(): Promise<`0x${string}`>;
    logout(): void;
    writeContract<const abi extends Abi | readonly unknown[], functionName extends ContractFunctionName<abi, "nonpayable" | "payable">, args extends ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>, chainId extends Config["chains"][number]["id"]>(parameters: WriteContractParameters<abi, functionName, args, Config, chainId>): Promise<void>;
    private showLoginDialog;
    private showWalletMismatchDialog;
}
declare const _default: KaiaWalletLoginManager;
export default _default;
//# sourceMappingURL=KaiaWalletLoginManager.d.ts.map