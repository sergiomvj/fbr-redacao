"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

export default function AlertasCentral() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-heading font-bold tracking-tight">Central de Alertas</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Intervenções de segurança e violações flagradas pelos Agentes e pela moderação.</p>
                </div>
                <Button variant="outline">Resolver Todos</Button>
            </div>

            <div className="space-y-4">

                {/* Critical Alert Mock */}
                <Card className="border-destructive/30 bg-destructive/5 shadow-sm">
                    <CardContent className="p-4 flex items-start gap-4">
                        <div className="bg-destructive/10 p-2 rounded-full mt-1 shrink-0">
                            <ShieldAlert className="h-5 w-5 text-destructive" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-semibold text-lg">Bloqueio de API - Limite de Custo (OpenAI)</h3>
                                <span className="text-xs text-muted-foreground">Há 5 min</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">O billing da OpenAI ultrapassou $50.00 diários. Módulo Journalist pausado preventivamente. Verifique o uso imediato.</p>
                            <div className="flex gap-2">
                                <Button size="sm" variant="destructive">Desbloquear Limite</Button>
                                <Button size="sm" variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10">Ver Logs</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Warning Alert Mock */}
                <Card className="border-amber-500/30 bg-amber-500/5 shadow-sm">
                    <CardContent className="p-4 flex items-start gap-4">
                        <div className="bg-amber-500/10 p-2 rounded-full mt-1 shrink-0">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-semibold text-lg">Tom inadequado detectado (Regional Editor)</h3>
                                <span className="text-xs text-muted-foreground">Há 45 min</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">A matéria "Crise no Governo" gerada na fila apresentou viés político não alinhado às diretrizes editoriais do Facebrasil.</p>
                            <div className="flex gap-2">
                                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">Reescrever Matéria</Button>
                                <Button size="sm" variant="outline" className="border-amber-500/20 text-amber-500 hover:bg-amber-500/10">Ignorar Falso Positivo</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Alert Mock */}
                <Card className="border-blue-500/30 bg-blue-500/5 shadow-sm">
                    <CardContent className="p-4 flex items-start gap-4">
                        <div className="bg-blue-500/10 p-2 rounded-full mt-1 shrink-0">
                            <Info className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-semibold text-lg">Novo Pico de Acessos</h3>
                                <span className="text-xs text-muted-foreground">Há 2 horas</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">Mais de 5.000 usuários simultâneos no portal principal agora devido à matéria sobre neve na Flórida.</p>
                            <div className="flex gap-2">
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Ver Analytics</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
