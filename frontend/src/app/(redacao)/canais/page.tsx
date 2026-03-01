"use client";

import { useEffect, useState } from "react";
import { Radio, Globe, Mail, Smartphone, Code2, BarChart3 } from "lucide-react";

interface ChannelSummary {
    website?: number;
    app?: number;
    newsletter?: number;
    social?: number;
    api?: number;
}

const CHANNEL_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    website: { label: "Website", icon: <Globe className="w-5 h-5" />, color: "text-blue-400" },
    app: { label: "App Mobile", icon: <Smartphone className="w-5 h-5" />, color: "text-emerald-400" },
    newsletter: { label: "Newsletter", icon: <Mail className="w-5 h-5" />, color: "text-violet-400" },
    social: { label: "Redes Sociais", icon: <Radio className="w-5 h-5" />, color: "text-amber-400" },
    api: { label: "API Externa", icon: <Code2 className="w-5 h-5" />, color: "text-pink-400" },
};

export default function CanaisPage() {
    const [summary, setSummary] = useState<ChannelSummary>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSummary() {
            try {
                const res = await fetch("/api/proxy/distributions/summary");
                if (!res.ok) throw new Error("Falha ao buscar canais");
                const data = await res.json();
                setSummary(data);
            } catch {
                setSummary({});
            } finally {
                setLoading(false);
            }
        }
        fetchSummary();
    }, []);

    const total = Object.values(summary).reduce((acc, v) => acc + (v ?? 0), 0);

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    Canais de Distribuição
                </h1>
                <p className="text-muted-foreground text-sm">
                    Visão geral dos canais onde os artigos da FBR-Redação são distribuídos.
                </p>
            </div>

            {/* Total badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium">
                {loading ? "Carregando..." : `${total} distribuições ativas`}
            </div>

            {/* Cards por canal */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-28 rounded-xl bg-card/50 animate-pulse border border-border" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(CHANNEL_META).map(([key, meta]) => {
                        const count = (summary as Record<string, number>)[key] ?? 0;
                        const pct = total > 0 ? Math.round((count / total) * 100) : 0;

                        return (
                            <div
                                key={key}
                                className="relative overflow-hidden rounded-xl border border-border bg-card p-5 space-y-3 hover:border-primary/40 transition-colors"
                            >
                                <div className={`flex items-center gap-2 font-semibold ${meta.color}`}>
                                    {meta.icon}
                                    <span>{meta.label}</span>
                                </div>

                                <div className="flex items-end justify-between">
                                    <span className="text-3xl font-bold text-foreground">{count}</span>
                                    <span className="text-sm text-muted-foreground">{pct}% do total</span>
                                </div>

                                {/* Barra de progresso */}
                                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all duration-700"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>

                                {count === 0 && (
                                    <p className="text-xs text-muted-foreground">Sem distribuições registradas</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <p className="text-xs text-muted-foreground">
                Os dados são preenchidos automaticamente pelo n8n ao final de cada ciclo de produção.
            </p>
        </div>
    );
}
