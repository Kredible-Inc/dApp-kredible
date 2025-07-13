"use client";

import { useState, useEffect } from "react";
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
import { Plus, Loader2 } from "lucide-react";
import { useCreatePlatform } from "@/shared/hooks/usePlatforms";
import { CreatePlatformRequest } from "@/shared/services/platformService";
import { useWallet } from "@/shared/hooks/useWallet";

export default function CreatePlatformModal() {
  const [open, setOpen] = useState(false);
  const { address } = useWallet();
  const createPlatformMutation = useCreatePlatform();

  const [formData, setFormData] = useState<CreatePlatformRequest>({
    name: "",
    description: "",
    contactEmail: "",
    ownerAddress: address || "",
    planType: "basic",
  });

  // Actualizar ownerAddress cuando la dirección de la wallet esté disponible
  useEffect(() => {
    if (address) {
      setFormData((prev) => ({
        ...prev,
        ownerAddress: address,
      }));
    }
  }, [address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      console.error("No hay wallet conectada");
      return;
    }

    const platformData = {
      ...formData,
      ownerAddress: address,
    };

    try {
      await createPlatformMutation.mutateAsync(platformData);

      setFormData({
        name: "",
        description: "",
        contactEmail: "",
        ownerAddress: address,
        planType: "basic",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error creating platform:", error);
    }
  };

  const handleInputChange = (
    field: keyof CreatePlatformRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange("description", e.target.value);
  };

  const handleInputChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(
      e.target.name as keyof CreatePlatformRequest,
      e.target.value
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
          <Plus className="h-4 w-4" />
          Crear Plataforma
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Plataforma</DialogTitle>
          <DialogDescription>
            Crea una nueva plataforma para gestionar préstamos descentralizados.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Plataforma</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChangeEvent}
              placeholder="Mi Plataforma de Prueba"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleTextareaChange}
              placeholder="Una plataforma para probar la API de Kredible"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email de Contacto</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleInputChangeEvent}
              placeholder="admin@miplataforma.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="planType">Tipo de Plan</Label>
            <Select
              value={formData.planType}
              onValueChange={(value) => handleInputChange("planType", value)}
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
              onClick={() => setOpen(false)}
              disabled={createPlatformMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createPlatformMutation.isPending}>
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
  );
}
