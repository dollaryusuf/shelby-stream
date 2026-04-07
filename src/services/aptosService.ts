import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { SHELBY_CONFIG } from "../constants";

const config = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(config);

export const getPurchasePayload = (creatorAddress: string) => {
  return {
    function: `${SHELBY_CONFIG.CONTRACT_ADDRESS}::marketplace::pay_for_read`,
    typeArguments: [],
    functionArguments: [creatorAddress],
  };
};

export const getRegisterContentPayload = (price: number, blobId: string) => {
  return {
    function: `${SHELBY_CONFIG.CONTRACT_ADDRESS}::marketplace::register_content`,
    typeArguments: [],
    functionArguments: [price, Array.from(new TextEncoder().encode(blobId))],
  };
};
