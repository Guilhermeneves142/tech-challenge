import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
    children: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Default Badge",
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Badge",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Badge",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Badge",
    variant: "ghost",
  },
};

export const Destructive: Story = {
  args: {
    children: "Destructive Badge",
    variant: "destructive",
  },
};



export const Link: Story = {
  args: {
    children: "Link Badge",
    variant: "link",
  },
};
