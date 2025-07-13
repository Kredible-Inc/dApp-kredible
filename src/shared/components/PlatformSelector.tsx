"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useWallet } from "@/shared/hooks/useWallet";
import { usePlatformStore } from "@/shared/stores/platformStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Building2 } from "lucide-react";
import {
  usePlatformsByOwner,
  useCreatePlatform,
} from "@/shared/hooks/usePlatforms";
import { CreatePlatformRequest } from "@/shared/services/platformService";

export default function PlatformSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { address, formatAddress } = useWallet();
  const { activePlatform, setActivePlatform } = usePlatformStore();

  // React Query hooks
  const { data: platforms = [], isLoading: platformsLoading } =
    usePlatformsByOwner(address);
  const createPlatformMutation = useCreatePlatform();

  // Debug logs
  console.log("PlatformSelector - platforms data:", platforms);
  console.log("PlatformSelector - platforms type:", typeof platforms);
  console.log("PlatformSelector - is array:", Array.isArray(platforms));
  console.log("PlatformSelector - platforms length:", platforms?.length);

  // Extraer el array real de plataformas
  const safePlatforms = Array.isArray(platforms?.data) ? platforms.data : [];

  const [formData, setFormData] = useState<CreatePlatformRequest>({
    name: "",
    description: "",
    contactEmail: "",
    ownerAddress: "",
    planType: "basic",
  });

  // Actualizar ownerAddress cuando la dirección de la wallet esté disponible
  useEffect(() => {
    if (address) {
      console.log("Actualizando ownerAddress con:", address);
      setFormData((prev: CreatePlatformRequest) => {
        const newFormData = {
          ...prev,
          ownerAddress: address,
        };
        console.log("Nuevo formData:", newFormData);
        return newFormData;
      });
    }
  }, [address]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !createModalOpen // No cerrar si el modal está abierto
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [createModalOpen]);

  const handlePlatformSelect = (platformId: string) => {
    setActivePlatform(platformId);
    router.push(`/platform/${platformId}`);
    setIsOpen(false);
  };

  const handleCreatePlatform = async (e: React.FormEvent) => {
    e.preventDefault();

    // Asegurar que el ownerAddress esté actualizado con la dirección actual
    if (!address) {
      console.error("No hay wallet conectada");
      return;
    }

    const currentFormData = {
      ...formData,
      ownerAddress: address,
    };

    console.log("Enviando datos de plataforma:", currentFormData);
    console.log("Dirección de wallet actual:", address);
    console.log("formData actual:", formData);

    try {
      await createPlatformMutation.mutateAsync(currentFormData);

      setFormData({
        name: "",
        description: "",
        contactEmail: "",
        ownerAddress: address || "", // Mantener la dirección de la wallet
        planType: "basic",
      });
      setCreateModalOpen(false);
      setIsOpen(false); // También cerrar el dropdown
    } catch (error) {
      console.error("Error creating platform:", error);
    }
  };

  const handleInputChange = (
    field: keyof CreatePlatformRequest,
    value: string
  ) => {
    setFormData((prev: CreatePlatformRequest) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Usar safePlatforms para el currentPlatform
  const currentPlatform =
    activePlatform ||
    (safePlatforms.length > 0 ? safePlatforms[0]?.id : "Ninguna");

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border border-primary rounded-lg hover:bg-primary/90 transition-colors shadow-lg font-medium"
      >
        <Building2 className="h-4 w-4 text-primary-foreground" />
        <span className="text-sm font-medium text-black">
          {platformsLoading
            ? "Cargando..."
            : Array.isArray(platforms) && platforms.length > 0
              ? `Plataforma: ${currentPlatform}`
              : "Seleccionar Plataforma"}
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
            {platformsLoading ? (
              <div className="px-4 py-2 text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando plataformas...
              </div>
            ) : safePlatforms.length === 0 ? (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                No hay plataformas disponibles
              </div>
            ) : (
              safePlatforms.map((platform) => {
                console.log("PlatformSelector - rendering platform:", platform);
                return (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformSelect(platform.id)}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      platform.id === currentPlatform
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {platform.id === currentPlatform && (
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                      )}
                      <span className="capitalize">
                        {platform.name || platform.id}
                      </span>
                    </div>
                  </button>
                );
              })
            )}

            {/* Separador */}
            <div className="border-t border-border my-2"></div>

            {/* Botón para crear plataforma */}
            <Dialog
              open={createModalOpen}
              onOpenChange={(open) => {
                setCreateModalOpen(open);
                if (open) {
                  console.log("Modal abierto - formData actual:", formData);
                  console.log("Modal abierto - address actual:", address);
                }
              }}
            >
              <DialogTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Crear Plataforma</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Plataforma</DialogTitle>
                  <DialogDescription>
                    Crea una nueva plataforma para gestionar préstamos
                    descentralizados.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreatePlatform} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre de la Plataforma</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Mi Plataforma de Prueba"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Una plataforma para probar la API de Kredible"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email de Contacto</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) =>
                        handleInputChange("contactEmail", e.target.value)
                      }
                      placeholder="admin@miplataforma.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerAddress">
                      Dirección del Propietario
                    </Label>
                    <Input
                      id="ownerAddress"
                      value={formData.ownerAddress}
                      disabled
                      className="bg-muted text-muted-foreground"
                      placeholder="Se llenará automáticamente con tu wallet"
                    />
                    <p className="text-xs text-muted-foreground">
                      Dirección actual:{" "}
                      {formData.ownerAddress
                        ? formatAddress(formData.ownerAddress)
                        : "No disponible"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tu dirección de wallet se usará automáticamente como
                      propietario de la plataforma
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="planType">Tipo de Plan</Label>
                    <Select
                      value={formData.planType}
                      onValueChange={(value) =>
                        handleInputChange("planType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Básico</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Empresarial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCreateModalOpen(false);
                        setIsOpen(false);
                      }}
                      disabled={createPlatformMutation.isPending}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={createPlatformMutation.isPending}
                    >
                      {createPlatformMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        "Crear Plataforma"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
}
