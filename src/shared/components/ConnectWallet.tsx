"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/shared/hooks/useWallet";
import { useAuth } from "@/shared/hooks/useAuth";
import { handleWalletAuth } from "@/shared/lib/auth";

export default function ConnectWallet() {
  const {
    address,
    isConnecting,
    isConnected,
    connect,
    disconnect,
    formatAddress,
    setWallet,
    clearWallet,
    checkConnection,
  } = useWallet();
  const { user, isAuthenticated, login, logout } = useAuth();
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected on component mount
    checkConnection();
  }, [checkConnection]);

  useEffect(() => {
    if (isConnected && address && !isAuthenticated && !isProcessingAuth) {
      handleWalletConnection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, isAuthenticated, isProcessingAuth]);

  const handleWalletConnection = async () => {
    if (!address) return;
    setIsProcessingAuth(true);
    try {
      const result = await handleWalletAuth(address);
      if (result.success) {
        setWallet({
          address,
          uid: result.user.id,
          platforms: result.user.platforms || [],
        });
        login(result.user);
      }
    } catch (error) {
      console.error("Error in wallet authentication:", error);
      clearWallet();
      logout();
    } finally {
      setIsProcessingAuth(false);
    }
  };

  if (isAuthenticated && user && address) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-500/20 rounded-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm font-mono text-green-300">
          {formatAddress(address)}
        </span>
        <span className="text-sm text-green-300">{user.name}</span>
        <button
          onClick={() => {
            disconnect();
            clearWallet();
            logout();
          }}
          className="ml-2 px-2 py-1 text-xs text-red-400 border border-red-400 rounded hover:bg-red-900/20"
        >
          Disconnect
        </button>
      </div>
    );
  }

  if (isConnected && address && !isAuthenticated) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
        <span className="text-sm font-mono text-yellow-300">
          {formatAddress(address)}
        </span>
        <div className="text-sm text-yellow-300">
          {isProcessingAuth ? "Verificando..." : "Wallet conectada"}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
    >
      {isConnecting ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Connecting...
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Connect Wallet
        </>
      )}
    </button>
  );
}
