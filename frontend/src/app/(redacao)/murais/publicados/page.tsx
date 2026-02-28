"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, ExternalLink, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const PUBLISHED_MOCK = [
    {
        id: "101",
        title: "Comunidade brasileira se reúne para festival de outono em Nova York",
        date: "12 Nov 2026, 14:30",
        region: "Nova Inglaterra",
        views: "1.2k",
        status: "live",
        url: "https://facebrasil.com/..."
    },
    {
        id: "102",
        title: "Novas regras de imigração: O que muda para estudantes internacionais",
        date: "12 Nov 2026, 10:15",
        region: "Nacional (US)",
        views: "5.8k",
        status: "live",
        url: "https://facebrasil.com/..."
    },
    {
        id: "103",
        title: "Destaques do esporte: Torneio de Jiu-Jitsu atrai centenas em Miami",
        date: "11 Nov 2026, 18:00",
        region: "Flórida",
        views: "890",
        status: "archived",
        url: "https://facebrasil.com/..."
    }
];

export default function MuralPublicados() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold tracking-tight">Mural de Publicados</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Acervo histórico e monitoramento de matérias que já foram enviadas ao site oficial.</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar títulos ou IDs..."
                        className="pl-9 bg-background"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filtros</Button>
                <Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> Últimos 7 dias</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {PUBLISHED_MOCK.map((article) => (
                    <Card key={article.id} className="flex flex-col">
                        <CardHeader className="p-5 pb-3">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className="text-xs font-normal">
                                    {article.region}
                                </Badge>
                                {article.status === 'live' ? (
                                    <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                ) : (
                                    <span className="flex h-2 w-2 rounded-full bg-muted"></span>
                                )}
                            </div>
                            <CardTitle className="text-lg leading-snug">{article.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 pt-0 flex-1">
                            <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                                <span>{article.date}</span>
                                <span><strong className="text-foreground">{article.views}</strong> visualizações</span>
                            </div>
                        </CardContent>
                        <CardFooter className="p-5 pt-0 mt-auto border-t border-border mt-4">
                            <div className="flex items-center justify-between w-full pt-4">
                                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Histórico da IA</Button>
                                <Button variant="secondary" size="sm" asChild>
                                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                                        Acessar Portal <ExternalLink className="ml-2 h-3 w-3" />
                                    </a>
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
