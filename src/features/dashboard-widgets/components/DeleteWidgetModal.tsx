"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@vandrei/finance-ui";
import type { DashboardWidget } from "@/lib/api";

export interface DeleteWidgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widget?: DashboardWidget;
  onConfirm: (id: number) => Promise<void>;
}

export function DeleteWidgetModal({
  open,
  onOpenChange,
  widget,
  onConfirm,
}: DeleteWidgetModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!widget) return;
    setError(null);
    setLoading(true);
    try {
      await onConfirm(widget.id);
      onOpenChange(false);
    } catch {
      setError("Não foi possível excluir o widget. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-6 gap-0" 
        showCloseButton 
        aria-labelledby="delete-widget-title"
        aria-describedby="delete-widget-description">
        <DialogHeader className="mb-2">
          <DialogTitle>Excluir Widget</DialogTitle>
        </DialogHeader>

        <div className="my-2 flex flex-col gap-2">
          <p className="text-base leading-relaxed text-card-foreground">
            Tem certeza que deseja excluir o widget{" "}
            <strong>{widget?.title}</strong> do seu dashboard?
          </p>
          {error && <p className="text-caption text-feedback-error">{error}</p>}
        </div>

        <DialogFooter className="mt-4 bg-white border-none">
          <DialogClose render={<Button variant="outline" disabled={loading} />}>
            Cancelar
          </DialogClose>
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="bg-feedback-error text-white hover:bg-feedback-error/90"
          >
            {loading ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
