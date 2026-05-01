import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from "@/components/ui/button/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover"
 
const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
}
 
export default meta
type Story = StoryObj<typeof Popover>
 
export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
}
 
export const WithoutHeader: Story = {
  name: "Sem header — só conteúdo",
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open</Button>} />
      <PopoverContent>
        <p className="text-sm text-muted-foreground">
          Este popover não possui título nem descrição, apenas conteúdo livre.
        </p>
      </PopoverContent>
    </Popover>
  ),
}