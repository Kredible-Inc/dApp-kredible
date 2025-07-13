import { create } from "zustand";
import {
  connectWallet,
  disconnectWallet,
  getPublicKey,
  signTransaction,
} from "@/shared/lib/stellar-wallet-kit";

interface WalletState {
  address: string | null;
  uid: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  setWallet: (data: { address: string; uid: string }) => void;
  clearWallet: () => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  checkConnection: () => Promise<void>;
  signTransaction: (xdr: string, network: string) => Promise<string>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  uid: null,
  isConnected: false,
  isConnecting: false,
  setWallet: ({ address, uid }) => set({ address, uid, isConnected: true }),
  clearWallet: () =>
    set({
      address: null,
      uid: null,
      isConnected: false,
      isConnecting: false,
    }),
  connect: async () => {
    set({ isConnecting: true });
    try {
      await connectWallet((address: string) => {
        console.log("Wallet conectada con dirección:", address);
        set({
          address,
          isConnected: true,
          isConnecting: false,
        });
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      set({ isConnecting: false });
      throw error;
    }
  },
  disconnect: () => {
    disconnectWallet();
    set({
      address: null,
      uid: null,
      isConnected: false,
      isConnecting: false,
    });
  },
  checkConnection: async () => {
    try {
      const address = await getPublicKey();
      console.log("checkConnection - Dirección obtenida:", address);
      if (address) {
        set({
          address,
          isConnected: true,
        });
      } else {
        set({
          address: null,
          isConnected: false,
        });
      }
    } catch {
      console.log("No wallet connected");
      set({
        address: null,
        isConnected: false,
      });
    }
  },
  signTransaction: async (xdr: string, network: string) => {
    const { address } = get();
    if (!address) {
      throw new Error("Wallet not connected");
    }
    return await signTransaction(xdr, network);
  },
}));
