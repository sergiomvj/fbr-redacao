"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

interface AlertItem {
    id: string;
    type: string;
    status: string;
    message: string;
    agent_name: string | null;
    region_name: string | null;
    time_ago: string;
}

export default function AlertasCentral() {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAlerts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/proxy/metrics/alerts');
            if (!res.ok) throw new Error('Falha ao buscar alertas');
            const data = await res.json();
            setAlerts(data);
        } catch (err: any) {
            setError(err.message || 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'llm_fallback':
                return <ShieldAlert className="h-5 w-5 text-destructive" />;
            case 'high_rejection_rate':
                return <AlertTriangle className="h-5 w-5 text-amber-500" />;
            case 'ugc_queue_overflow':
                return <Info className="h-5 w-5 text-blue-500" />;
            default:
                return <Info className="h-5 w-5 text-muted-foreground" />;
        }
    };

    const getAlertStyles = (type: string) => {
        switch (type) {
            case 'llm_fallback':
                return "border-destructive/30 bg-destructive/5 text-destructive";
            case 'high_rejection_rate':
                return "border-amber-500/30 bg-amber-500/5 text-amber-500";
            case 'ugc_queue_overflow':
                return "border-blue-500/30 bg-blue-500/5 text-blue-500";
            default:
                return "border-border bg-muted text-muted-foreground";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-heading font-bold tracking-tight">Central de Alertas</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Intervenções de segurança e violações flagradas pelos Agentes e pela moderação.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchAlerts} disabled={isLoading}>
                        {isLoading ? 'Atualizando...' : 'Atualizar'}
                    </Button>
                    <Button variant="outline">Resolver Todos</Button>
                </div>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                    {error}
                </div>
            )}

            {!isLoading && alerts.length === 0 && !error && (
                <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
                    Nenhum alerta ativo no momento.
                </div>
            )}

            <div className="space-y-4">
                {alerts.map((alert) => {
                    const styles = getAlertStyles(alert.type);
                    return (
                        <Card key={alert.id} className={`${styles.split(' ')[0]} ${styles.split(' ')[1]} shadow-sm`}>
                            <CardContent className="p-4 flex items-start gap-4">
                                <div className={`${styles.split(' ')[1].replace('5', '10')} p-2 rounded-full mt-1 shrink-0`}>
                                    {getAlertIcon(alert.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            {alert.type.replace(/_/g, ' ').toUpperCase()}
                                            {alert.agent_name && (
                                                <span className="text-xs font-normal text-muted-foreground">({alert.agent_name})</span>
                                            )}
                                        </h3>
                                        <span className="text-xs text-muted-foreground">{alert.time_ago}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">{alert.message}</p>
                                    <div className="flex gap-2">
                                        {alert.status === 'open' && (
                                            <Button size="sm" variant={alert.type === 'llm_fallback' ? 'destructive' : 'default'} className={alert.type === 'high_rejection_rate' ? 'bg-amber-600 hover:bg-amber-700 text-white' : alert.type === 'ugc_queue_overflow' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}>
                                                Resolver Pendência
                                            </Button>
                                        )}
                                        <Button size="sm" variant="outline" className={`${styles.split(' ')[0]} ${styles.split(' ')[2]} hover:bg-black/5`}>
                                            Marcar Ciente
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
