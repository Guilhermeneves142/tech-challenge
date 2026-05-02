import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Label } from "@/components/ui/label/label"
import { RadioGroup, RadioGroupItem } from "./radio-group"
 
const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
}
 
export default meta
type Story = StoryObj<typeof RadioGroup>
 
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="option-1" />
        <Label htmlFor="option-1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="option-2" />
        <Label htmlFor="option-2">Option 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-3" id="option-3" />
        <Label htmlFor="option-3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
}
 
export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="d-option-1" />
        <Label htmlFor="d-option-1">Habilitado</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="d-option-2" disabled />
        <Label htmlFor="d-option-2" className="opacity-50 cursor-not-allowed">
          Desabilitado
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-3" id="d-option-3" disabled />
        <Label htmlFor="d-option-3" className="opacity-50 cursor-not-allowed">
          Desabilitado selecionado
        </Label>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const radios = canvasElement.querySelectorAll("[data-slot='radio-group-item']")
    const third = radios[2] as HTMLElement
    third?.click()
  },
}
 
export const Invalid: Story = {
  render: () => (
    <RadioGroup>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="i-option-1" aria-invalid />
        <Label htmlFor="i-option-1">Opção A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="i-option-2" aria-invalid />
        <Label htmlFor="i-option-2">Opção B</Label>
      </div>
      <p className="text-xs text-destructive mt-1">Selecione uma opção.</p>
    </RadioGroup>
  ),
}