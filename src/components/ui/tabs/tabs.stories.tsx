import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Tabs>

const listCn = "w-full bg-brand-primary rounded-[10px] !h-[35px]"
const triggerCn = "flex-1 !h-[29px] rounded-[10px] py-1 px-2 cursor-pointer text-white hover:text-white hover:bg-white/10 data-active:bg-brand-secondary data-active:text-brand-primary data-active:shadow-sm data-active:hover:brightness-95 data-active:hover:bg-brand-secondary"

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-96">
      <TabsList className={listCn}>
        <TabsTrigger value="account" className={triggerCn}>Account</TabsTrigger>
        <TabsTrigger value="password" className={triggerCn}>Password</TabsTrigger>
        <TabsTrigger value="settings" className={triggerCn}>Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-muted-foreground">Gerencie as informações da sua conta.</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-muted-foreground">Altere sua senha aqui.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-muted-foreground">Ajuste suas preferências.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const WithDisabled: Story = {
  name: "Com tab desabilitada",
  render: () => (
    <Tabs defaultValue="active" className="w-96">
      <TabsList className={listCn}>
        <TabsTrigger value="active" className={triggerCn}>Active</TabsTrigger>
        <TabsTrigger value="disabled" className={triggerCn} disabled>Disabled</TabsTrigger>
        <TabsTrigger value="other" className={triggerCn}>Other</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <p className="text-muted-foreground">Esta aba está ativa.</p>
      </TabsContent>
      <TabsContent value="other">
        <p className="text-muted-foreground">Conteúdo da outra aba.</p>
      </TabsContent>
    </Tabs>
  ),
}