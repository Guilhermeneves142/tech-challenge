import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import { Button } from "@/components/ui/button/button"

const meta: Meta<typeof DialogContent> = {
  title: "Components/Dialog",
  component: DialogContent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
}
export default meta
type Story = StoryObj<typeof DialogContent>

const DialogTemplate = (props: React.ComponentProps<typeof DialogContent>) => (
  <Dialog>
    <DialogTrigger render={<Button />}>Abrir Dialog</DialogTrigger>
    <DialogContent {...props} />
  </Dialog>
)

export const Default: Story = {
  render: () => (
    <DialogTemplate>
      <DialogHeader>
        <DialogTitle>Título do Dialog</DialogTitle>
        <DialogDescription>
          Essa é a descrição do dialog. Use para dar contexto ao usuário.
        </DialogDescription>
      </DialogHeader>
      <p className="text-sm text-muted-foreground">
        Conteúdo principal do dialog pode ir aqui.
      </p>
      <DialogFooter showCloseButton>
        <Button>Confirmar</Button>
      </DialogFooter>
    </DialogTemplate>
  ),
}
