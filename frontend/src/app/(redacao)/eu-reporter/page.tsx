"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, CheckCircle, XCircle, MapPin, Clock } from "lucide-react";

const UGC_MOCK = [
    {
        id: "UGC-01",
        author: "Maria S.",
        location: "Orlando, FL",
        timeAgo: "Há 15 min",
        title: "Chuva forte na I-4 causando engarrafamento",
        description: "Mandei este vídeo gravado agora às 14h mostrando o engavetamento causado pelas chuvas cruzando a Internacional Drive.",
        type: "video",
        tags: ["Clima", "Trânsito"],
        aiScore: 88,
        bounty: "$5"
    },
    {
        id: "UGC-02",
        author: "João P.",
        location: "Miami, FL",
        timeAgo: "Há 42 min",
        title: "Festival de comida brasileira em Wynwood",
        description: "Fotos do evento de ontem à noite que reuniu vários food trucks locais.",
        type: "image",
        tags: ["Comunidade", "Eventos"],
        aiScore: 95,
        bounty: "$10"
    },
    {
        id: "UGC-03",
        author: "Carlos A.",
        location: "Newark, NJ",
        timeAgo: "Há 2 horas",
        title: "Acidente leve na rota 21",
        description: "Apenas um relato em texto sobre lentidão.",
        type: "text",
        tags: ["Trânsito"],
        aiScore: 45,
        bounty: "$0"
    }
];

export default function EuReporterFila() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-heading font-bold tracking-tight">Eu Repórter - Fila de Moderação</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Contéudos enviados pela comunidade (UGC) aguardando curadoria.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Histórico</Button>
                    <Button variant="outline">Configurações de Recompensa</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {UGC_MOCK.map((item) => (
                    <Card key={item.id} className="flex flex-col">
                        <CardHeader className="p-4 pb-2 border-b border-border/50">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <MapPin className="h-3 w-3" /> {item.location}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" /> {item.timeAgo}
                                </div>
                            </div>
                            <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>

                            <div className="flex items-center justify-between mt-3">
                                <div className="flex gap-2">
                                    <Badge variant="outline" className={item.type === 'video' ? "text-orange-500 border-orange-500/30" : "text-blue-500 border-blue-500/30"}>
                                        {item.type.toUpperCase()}
                                    </Badge>
                                    {item.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                                    ))}
                                </div>

                                <div
                                    className={`text-xs font-bold px-2 py-0.5 rounded ${item.aiScore > 80 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}
                                    title="Score de Relevância IA"
                                >
                                    IA: {item.aiScore}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 flex-1 flex flex-col">
                            <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4 relative overflow-hidden group border border-border">
                                {item.type === 'video' && (
                                    <>
                                        <PlayCircle className="h-12 w-12 text-primary/50 absolute z-10 group-hover:scale-110 transition-transform" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-stone-900 to-stone-800 opacity-60"></div>
                                    </>
                                )}
                                {item.type === 'image' && (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-purple-900/40 opacity-60"></div>
                                )}
                                {item.type === 'text' && (
                                    <p className="text-muted-foreground font-mono text-xs">Apenas Texto</p>
                                )}
                            </div>

                            <p className="text-sm line-clamp-3 flex-1">{item.description}</p>
                            <p className="text-xs text-muted-foreground mt-4">Enviado por: <span className="font-semibold text-foreground">{item.author}</span></p>

                            <div className="border-t border-border pt-4 mt-4 flex gap-2">
                                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <CheckCircle className="mr-2 h-4 w-4" /> Aprovar ({item.bounty})
                                </Button>
                                <Button variant="destructive" className="flex-1">
                                    <XCircle className="mr-2 h-4 w-4" /> Rejeitar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
