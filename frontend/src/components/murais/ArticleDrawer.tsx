import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ArticleDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    content: string;
}

export function ArticleDrawer({ isOpen, onOpenChange, title, content }: ArticleDrawerProps) {
    return (
        <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
            <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-full max-w-2xl rounded-none">
                <DrawerHeader className="border-b border-border text-left">
                    <DrawerTitle className="text-2xl font-heading">{title}</DrawerTitle>
                    <DrawerDescription>Edição Manual e Histórico do Agente</DrawerDescription>
                </DrawerHeader>

                <div className="p-6 flex-1 overflow-y-auto">
                    {/* Markdown Editor Placeholder */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Conteúdo (Markdown)</label>
                            <Textarea
                                className="min-h-[400px] font-mono text-sm leading-relaxed resize-none"
                                defaultValue={content}
                            />
                        </div>
                    </div>
                </div>

                <DrawerFooter className="border-t border-border flex-row justify-end space-x-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DrawerClose>
                    <Button>Salvar e Aprovar</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
