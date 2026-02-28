import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle } from "lucide-react";

export default function EuReporterFila() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-heading font-bold tracking-tight">Eu Repórter - Fila de Moderação</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Contéudos enviados pela comunidade (UGC) aguardando curadoria.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* UGC Card Mock */}
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Flórida / Orlando</span>
                            <span className="text-xs text-muted-foreground">Há 15 min</span>
                        </div>
                        <CardTitle className="text-lg">Vídeo da chuva forte na I-4</CardTitle>
                        <div className="flex gap-2 mt-2">
                            <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">Vídeo</Badge>
                            <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20">Clima</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4 relative overflow-hidden">
                            <PlayCircle className="h-12 w-12 text-primary/50 absolute z-10" />
                            {/* Img preview placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-stone-900 to-stone-800 opacity-60"></div>
                        </div>

                        <p className="text-sm mb-4 line-clamp-3">Mandei este vídeo gravado agora às 14h mostrando o engavetamento causado pelas chuvas cruzando a Internacional Drive.</p>

                        <div className="border-t border-border pt-4 flex gap-2">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle className="mr-2 h-4 w-4" /> Aprovar ($5)</Button>
                            <Button variant="destructive" className="w-full">Rejeitar</Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
