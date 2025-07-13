import {
  StellarWalletsKit,
  WalletNetwork,
  FreighterModule,
  ISupportedWallet,
  FREIGHTER_ID,
} from "@creit.tech/stellar-wallets-kit";

let kit: StellarWalletsKit | null = null;

function getKit(): StellarWalletsKit {
  if (!kit) {
    kit = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: [new FreighterModule()],
    });
  }
  return kit;
}

export async function connectWallet(onConnected?: (address: string) => void) {
  const walletKit = getKit();
  await walletKit.openModal({
    onWalletSelected: async (option: ISupportedWallet) => {
      walletKit.setWallet(option.id);
      const { address } = await walletKit.getAddress();
      if (onConnected) onConnected(address);
    },
  });
}

export async function getPublicKey(): Promise<string | null> {
  try {
    const walletKit = getKit();
    const { address } = await walletKit.getAddress();
    return address;
  } catch {
    return null;
  }
}

export function disconnectWallet() {
  if (kit) {
    kit.disconnect();
  }
}

export async function signTransaction(
  xdr: string,
  network: string
): Promise<string> {
  const walletKit = getKit();
  const { address } = await walletKit.getAddress();
  const { signedTxXdr } = await walletKit.signTransaction(xdr, {
    address,
    networkPassphrase:
      network === "TESTNET" ? WalletNetwork.TESTNET : WalletNetwork.PUBLIC,
  });
  return signedTxXdr;
}
