"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Plus, Settings, Play, Square, Activity, Cpu } from "lucide-react";

const AGENTS_MOCK = [
    { id: "1", name: "Collector Alpha", type: "collector", status: "running", llm: "OpenAI GPT-4", health: "98%" },
    { id: "2", name: "Journalist BR", type: "journalist", status: "idle", llm: "Claude 3.5 Sonnet", health: "100%" },
    { id: "3", name: "Art Vision", type: "art", status: "stopped", llm: "Stable Diffusion API", health: "offline" },
    { id: "4", name: "Regional Editor FL", type: "regional_editor", status: "running", llm: "Llama 3 Local", health: "95%" }
];

export default function AgentesGrid() {
    const [agents, setAgents] = useState(AGENTS_MOCK);

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
                {agents.map((agent) => (
                    <Card key={agent.id} className="flex flex-col border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="p-5 pb-3">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className="text-xs capitalize flex items-center gap-1">
                                    <Cpu className="h-3 w-3" /> {agent.type.replace('_', ' ')}
                                </Badge>

                                {agent.status === 'running' && <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">Running</Badge>}
                                {agent.status === 'idle' && <Badge variant="secondary">Idle</Badge>}
                                {agent.status === 'stopped' && <Badge variant="destructive">Stopped</Badge>}
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
                                    <span className="text-muted-foreground">Health/Taxa Sucesso:</span>
                                    <span className={agent.status === "stopped" ? "text-destructive" : "text-emerald-500"}>
                                        {agent.health}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 bg-muted/30 border-t border-border mt-auto flex justify-between">
                            <div className="flex gap-2">
                                {agent.status === 'stopped' ? (
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
