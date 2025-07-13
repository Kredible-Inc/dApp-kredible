"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useWallet } from "@/shared/hooks/useWallet";
import { usePlatformStore } from "@/shared/stores/platformStore";

export default function PlatformSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { platforms } = useWallet();
  const { activePlatform, setActivePlatform } = usePlatformStore();

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Si solo hay una plataforma, no mostrar el selector
  if (platforms.length <= 1) {
    return null;
  }

  const handlePlatformSelect = (platformId: string) => {
    setActivePlatform(platformId);
    router.push(`/dashboard/platform/${platformId}`);
    setIsOpen(false);
  };

  const currentPlatform = activePlatform || platforms[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full hover:bg-accent transition-colors"
      >
        <div className="w-2 h-2 bg-primary rounded-full"></div>
        <span className="text-sm font-medium text-foreground">
          Cambiar a: {currentPlatform}
        </span>
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="py-2">
            {platforms.map((platformId) => (
              <button
                key={platformId}
                onClick={() => handlePlatformSelect(platformId)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  platformId === currentPlatform
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-2">
                  {platformId === currentPlatform && (
                    <div className="w-2 h-2 bg-current rounded-full"></div>
                  )}
                  <span className="capitalize">{platformId}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
