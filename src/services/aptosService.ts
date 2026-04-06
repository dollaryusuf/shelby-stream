import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(config);

export const SHELBY_MODULE_ADDRESS = "0x1"; // Replace with actual module address

export const getPurchasePayload = (creatorAddress: string) => {
  return {
    function: `${SHELBY_MODULE_ADDRESS}::marketplace::purchase_read_access`,
    typeArguments: [],
    functionArguments: [creatorAddress],
  };
};

export const getRegisterContentPayload = (price: number, blobId: string) => {
  return {
    function: `${SHELBY_MODULE_ADDRESS}::marketplace::register_content`,
    typeArguments: [],
    functionArguments: [price, Array.from(new TextEncoder().encode(blobId))],
  };
};
