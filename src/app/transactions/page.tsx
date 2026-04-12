import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TransactionsPage() {
    return (
        <>
            <Card className="flex flex-row items-end 4 py-6 overflow-visible px-6">
                <div className="flex flex-col gap-1">
                    <Label>Período</Label>
                    <Input 
                        type="date" 
                        className="cursor-pointer w-44" 
                    />
                </div>
                <div className="relative flex flex-col gap-1 flex-1">
                    <Label>Buscar</Label>
                    <div className="relative">
                        <Search 
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-primary"
                         />
                        <Input 
                            type="search" 
                            placeholder="" 
                            className="pl-8" 
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-1 w-48">
                    <Label>Tipo</Label>
                    <Select>
                        <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue 
                                placeholder="Todos os tipos" 
                            />
                        </SelectTrigger>
                        <SelectContent side="bottom" className="p-1" sideOffset={6} align="start" alignItemWithTrigger={false}>
                            <SelectItem className="cursor-pointer" value="1">1</SelectItem>
                            <SelectItem className="cursor-pointer" value="2">2</SelectItem>
                            <SelectItem className="cursor-pointer" value="3">3</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="default" className="cursor-pointer shrink-0">
                    <Plus size={16} />
                    Nova Transação
                </Button>
            </Card>
        </>
    )
}