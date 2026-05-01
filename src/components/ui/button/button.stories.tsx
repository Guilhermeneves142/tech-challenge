import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './button';
import { Plus } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg"],
    },
    children: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Default Button",
    variant: "default",
  },
};

export const WithIcon: Story = {
  render: () => (
    <Button>
      <Plus data-icon="inline-start" />
      Adicionar
    </Button>
  ),
}

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
  },
};


export const Link: Story = {
  args: {
    children: "Link Button",
    variant: "link",
  },
};
