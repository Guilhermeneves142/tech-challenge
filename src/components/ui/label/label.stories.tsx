import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Label } from "@/components/ui/label/label"
import { Input } from "@/components/ui/inputs/input"

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"], 
  args: {
    children: "Nome completo",
  },
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  render: (args) => <Label {...args} />,
}

export const WithInput: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5 w-60">
      <Label {...args} htmlFor="name">Email</Label>
      <Input id="name" placeholder="seu@email.com" />
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5 w-60" data-disabled="true">
      <Label {...args} className="group-data-[disabled=true]:opacity-50 opacity-50">
        Campo desabilitado
      </Label>
      <Input placeholder="Desabilitado" disabled />
    </div>
  ),
}