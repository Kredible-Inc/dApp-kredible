import { use } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { useWallet } from "@/shared/hooks/useWallet";
import { usePlatformStore } from "@/shared/stores/platformStore";
import { usePlatformsByOwner } from "@/shared/hooks/usePlatforms";
import Link from "next/link";
import PlatformDashboardClient from "./PlatformDashboardClient";

export default function PlatformDashboardPage({
  params,
}: {
  params: Promise<{ platformId: string }>;
}) {
  const { platformId } = use(params);

  return <PlatformDashboardClient platformId={platformId} />;
}
