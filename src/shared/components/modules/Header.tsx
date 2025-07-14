"use client";

import ConnectWallet from "@/shared/components/ConnectWallet";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex justify-center items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/kredible-white.jpg"
                alt="dApp Kredible"
                width={75}
                height={50}
              />
              <h1 className="text-2xl font-semibold text-foreground">
                Kredible
              </h1>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
