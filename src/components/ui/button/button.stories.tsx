import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './button';

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

export const Destructive: Story = {
  args: {
    children: "Destructive Button",
    variant: "destructive",
  },
};



export const Link: Story = {
  args: {
    children: "Link Button",
    variant: "link",
  },
};


export const ButtonSizeXs: Story = {
  args: {
    children: "Size xs",
    variant: "default",
    size: "xs"
  },
};

export const ButtonSizeSm: Story = {
  args: {
    children: "Size sm",
    variant: "default",
    size: "sm"
  },
};

export const ButtonSizeLg: Story = {
  args: {
    children: "Size lg",
    variant: "default",
    size: "lg"
  },
};
