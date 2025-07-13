"use client";

import ConnectWallet from "@/shared/components/ConnectWallet";

export default function Header() {
  return (
    <header className="border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground">
            dApp Kredible
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
