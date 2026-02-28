"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, FileText, MousePointerClick, ArrowUpRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_CHART = [
    { name: 'Seg', pageviews: 4000, usuarios: 2400 },
    { name: 'Ter', pageviews: 3000, usuarios: 1398 },
    { name: 'Qua', pageviews: 2000, usuarios: 9800 },
    { name: 'Qui', pageviews: 2780, usuarios: 3908 },
    { name: 'Sex', pageviews: 1890, usuarios: 4800 },
    { name: 'Sab', pageviews: 2390, usuarios: 3800 },
    { name: 'Dom', pageviews: 3490, usuarios: 4300 },
];

export default function AnalyticsDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-heading font-bold tracking-tight">Métricas de Sucesso</h2>
                <p className="text-muted-foreground mt-1 text-sm">Acompanhe as KPIs de tráfego, engajamento e conversão.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Usuários Ativos (24h)", value: "12.5K", icon: Users, trend: "+14.2%" },
                    { title: "Matérias Publicadas (7d)", value: "342", icon: FileText, trend: "+5.1%" },
                    { title: "Sessões Totais", value: "89.2K", icon: Activity, trend: "+22.4%" },
                    { title: "Taxa de Cliques (CTR)", value: "4.2%", icon: MousePointerClick, trend: "-1.1%", trendDown: true }
                ].map((kpi, i) => (
                    <Card key={i} className="border-border/50 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                            <kpi.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <p className={\`text-xs mt-1 flex items-center gap-1 \${kpi.trendDown ? 'text-destructive' : 'text-emerald-500'}\`}>
                            {!kpi.trendDown && <ArrowUpRight className="h-3 w-3" />}
                            {kpi.trend} em relação à semana anterior
                        </p>
                    </CardContent>
          </Card>
        ))}
        </div>

      {/* Charts Area */ }
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg">Tráfego vs Engajamento</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MOCK_CHART} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => \`\${val / 1000}k\`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        />
                        <Line type="monotone" dataKey="pageviews" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="usuarios" stroke="#888" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

        {/* Top Articles List */}
        <Card className="border-border/50 shadow-sm flex flex-col">
            <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-lg">Matérias em Destaque</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-4 border-b border-border/50 last:border-0 flex items-center justify-between hover:bg-muted/30 transition-colors">
                        <div className="overflow-hidden">
                            <h4 className="text-sm font-medium line-clamp-1">Incêndio de grandes proporções no centro...</h4>
                            <p className="text-xs text-muted-foreground mt-1">Há 2 horas • Orlando</p>
                        </div>
                        <div className="text-sm font-bold ml-4">2.{i}k</div>
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
    </div >
  );
}
