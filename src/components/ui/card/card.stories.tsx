import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from './card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['default', 'sm'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: { size: 'default' },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Título do Card</CardTitle>
        <CardDescription>Descrição do card aqui.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Conteúdo do card.</p>
      </CardContent>
      <CardFooter>
        <p>Rodapé do card</p>
      </CardFooter>
    </Card>
  ),
}

export const WithAction: Story = {
  args: { size: 'default' },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Card com Ação</CardTitle>
        <CardDescription>Com botão no header.</CardDescription>
        <CardAction>
          <button className="text-xs text-primary">Ver mais</button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Conteúdo do card.</p>
      </CardContent>
    </Card>
  ),
}

export const WithoutFooter: Story = {
  args: { size: 'default' },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Sem Rodapé</CardTitle>
        <CardDescription>Card sem CardFooter.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Conteúdo do card.</p>
      </CardContent>
    </Card>
  ),
}