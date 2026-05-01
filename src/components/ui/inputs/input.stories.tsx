import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from "@/components/ui/inputs/input"
import { Snowflake } from 'lucide-react'

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"], 
  args: {
    placeholder: "Digite algo...",
  },
}

export default meta
type Story = StoryObj<typeof Input>


export const Default: Story = {
  render: (args) => (
    <div className='flex align-middle justify-center w-60'>
       <Input {...args} />
    </div>

  ),
}

export const WithIcon: Story = {
  args: {
    placeholder: "Input com ícone",
    icon: <Snowflake className="size-4 text-primary" />,
    iconSide: "left",
  },
  render: (args) => (
    <div className="flex justify-center w-60">
      <Input {...args} />
    </div>
  ),
}