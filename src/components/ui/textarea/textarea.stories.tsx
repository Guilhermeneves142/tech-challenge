import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Label } from "@/components/ui/label/label"
import { Textarea } from "./textarea"
 
const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
}
 
export default meta
type Story = StoryObj<typeof Textarea>
 
export const Default: Story = {
  render: () => <Textarea placeholder="Digite algo..." className="w-80" />,
}
 
export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 w-80">
      <Label htmlFor="message">Mensagem</Label>
      <Textarea id="message" placeholder="Escreva sua mensagem..." />
    </div>
  ),
}
 
export const Disabled: Story = {
  render: () => (
    <Textarea
      className="w-80"
      placeholder="Campo desabilitado"
      disabled
    />
  ),
}