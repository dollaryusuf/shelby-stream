import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getPurchasePayload, getRegisterContentPayload } from "../services/aptosService";

export const useAptosActions = () => {
  const { signAndSubmitTransaction } = useWallet();

  const purchaseReadAccess = async (creatorAddress: string) => {
    const payload = getPurchasePayload(creatorAddress);
    return await signAndSubmitTransaction({
      data: payload as any,
    });
  };

  const registerContent = async (price: number, blobId: string) => {
    const payload = getRegisterContentPayload(price, blobId);
    return await signAndSubmitTransaction({
      data: payload as any,
    });
  };

  return {
    purchaseReadAccess,
    registerContent,
  };
};
