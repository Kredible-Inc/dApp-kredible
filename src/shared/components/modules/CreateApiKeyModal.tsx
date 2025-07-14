"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Key, Loader2 } from "lucide-react";
import { useCreateApiKey } from "@/shared/hooks/useApiKeys";
import { CreateApiKeyRequest } from "@/shared/services/apiKeyService";

interface CreateApiKeyModalProps {
  platformId: string;
  platformName: string;
  contactEmail: string;
}

export default function CreateApiKeyModal({
  platformId,
  platformName,
  contactEmail,
}: CreateApiKeyModalProps) {
  const [open, setOpen] = useState(false);
  const createApiKeyMutation = useCreateApiKey();

  const [formData, setFormData] = useState<CreateApiKeyRequest>({
    platformId,
    contactEmail,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createApiKeyMutation.mutateAsync(formData);
      setOpen(false);
    } catch (error) {
      console.error("Error creating API key:", error);
    }
  };

  const handleInputChange = (
    field: keyof CreateApiKeyRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Key className="h-4 w-4" />
          Crear API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear API Key</DialogTitle>
          <DialogDescription>
            Crea una nueva API Key para {platformName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platformId">ID de Plataforma</Label>
            <Input
              id="platformId"
              value={formData.platformId}
              disabled
              className="bg-muted text-muted-foreground"
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createApiKeyMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createApiKeyMutation.isPending}>
              {createApiKeyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear API Key"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
