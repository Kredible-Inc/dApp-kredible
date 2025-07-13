import { useWalletStore } from "@/shared/stores/walletStore";

export const useWallet = () => {
  const address = useWalletStore((state) => state.address);
  const uid = useWalletStore((state) => state.uid);
  const isConnected = useWalletStore((state) => state.isConnected);
  const isConnecting = useWalletStore((state) => state.isConnecting);
  const setWallet = useWalletStore((state) => state.setWallet);
  const clearWallet = useWalletStore((state) => state.clearWallet);
  const connect = useWalletStore((state) => state.connect);
  const disconnect = useWalletStore((state) => state.disconnect);
  const checkConnection = useWalletStore((state) => state.checkConnection);
  const signTransaction = useWalletStore((state) => state.signTransaction);

  return {
    address,
    uid,
    isConnected,
    isConnecting,
    setWallet,
    clearWallet,
    connect,
    disconnect,
    checkConnection,
    signTransaction,
    formatAddress: (address: string) =>
      `${address.slice(0, 6)}...${address.slice(-4)}`,
  };
};
