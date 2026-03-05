"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Plus, Settings, Play, Square, Activity, Cpu } from "lucide-react";

export default function AgentesGrid() {
    const [agents, setAgents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAgents = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/proxy/agents");
            if (res.ok) {
                const data = await res.json();
                setAgents(data);
            } else {
                setError("Falha ao carregar agentes.");
            }
        } catch (err) {
            setError("Erro de rede.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold tracking-tight">Gerenciamento de Agentes</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Monitore logs e ligue/desligue os módulos de inteligência artificial.</p>
                </div>
                <Button className="shrink-0"><Plus className="mr-2 h-4 w-4" /> Novo Agente</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading && <p>Carregando agentes...</p>}
                {error && <p className="text-destructive">{error}</p>}
                {!loading && !error && agents.length === 0 && <p>Nenhum agente configurado no sistema.</p>}
                {agents.map((agent) => (
                    <Card key={agent.id} className="flex flex-col border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="p-5 pb-3">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className="text-xs capitalize flex items-center gap-1">
                                    <Cpu className="h-3 w-3" /> {agent.type.replace('_', ' ')}
                                </Badge>

                                {agent.status === 'online' && <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">Online</Badge>}
                                {agent.status === 'paused' && <Badge variant="secondary">Paused</Badge>}
                                {agent.status === 'offline' && <Badge variant="destructive">Offline</Badge>}
                                {agent.status === 'error' && <Badge variant="destructive">Error</Badge>}
                            </div>
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 pt-0 flex-1">
                            <div className="pt-2 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Modelo Base:</span>
                                    <span className="font-mono text-xs">{agent.llm}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Região:</span>
                                    <span className="font-medium text-xs">{agent.region || 'Global'}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 bg-muted/30 border-t border-border mt-auto flex justify-between">
                            <div className="flex gap-2">
                                {agent.status === 'offline' || agent.status === 'paused' ? (
                                    <Button size="icon" variant="outline" className="h-8 w-8 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10"><Play className="h-4 w-4" /></Button>
                                ) : (
                                    <Button size="icon" variant="outline" className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive/10"><Square className="h-4 w-4" /></Button>
                                )}
                                <Button size="icon" variant="outline" className="h-8 w-8"><Activity className="h-4 w-4 text-blue-500" /></Button>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs">
                                <Settings className="mr-2 h-3 w-3" /> Configs
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
