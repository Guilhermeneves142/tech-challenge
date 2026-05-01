import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Label } from "@/components/ui/label/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select"
 
const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
}
 
export default meta
type Story = StoryObj<typeof Select>
 
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Selececione uma fruta" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Pessego">Pessego</SelectItem>
        <SelectItem value="Banana">Banana</SelectItem>
        <SelectItem value="Pitaya">Pitaya</SelectItem>
        <SelectItem value="Graviola">Graviola</SelectItem>
      </SelectContent>
    </Select>
  ),
}