"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ChevronDown, MapPin, Database, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const REGIONS_MOCK = [
    {
        id: "br",
        name: "Brasil (Nacional)",
        level: "país",
        children: [
            {
                id: "br-sp",
                name: "São Paulo",
                level: "estado",
                children: [
                    { id: "br-sp-capital", name: "São Paulo (Capital)", level: "cidade", sources: 12 },
                    { id: "br-sp-campinas", name: "Campinas", level: "cidade", sources: 4 },
                ]
            },
            {
                id: "br-rj",
                name: "Rio de Janeiro",
                level: "estado",
                children: []
            }
        ]
    },
    {
        id: "us",
        name: "Estados Unidos (Nacional)",
        level: "país",
        children: [
            {
                id: "us-fl",
                name: "Flórida",
                level: "estado",
                children: [
                    { id: "us-fl-orl", name: "Orlando", level: "cidade", sources: 25 },
                    { id: "us-fl-mia", name: "Miami", level: "cidade", sources: 18 },
                ]
            }
        ]
    }
];

export default function RegioesTree() {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({ br: true, us: true, "br-sp": true, "us-fl": true });

    const toggleExpand = (id: string) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderNode = (node: any, depth = 0) => {
        const isExpanded = expanded[node.id];
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div key={node.id} className="select-none">
                <div
                    className="flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded-md cursor-pointer group"
                    style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
                    onClick={() => hasChildren && toggleExpand(node.id)}
                >
                    <div className="flex items-center gap-2">
                        {hasChildren ? (
                            isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <div className="w-4" />
                        )}
                        <MapPin className="h-4 w-4 text-primary/70" />
                        <span className="font-medium text-sm">{node.name}</span>
                        <Badge variant="outline" className="text-[10px] font-normal h-4 px-1.5 ml-2 uppercase opacity-70">{node.level}</Badge>
                    </div>

                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {node.sources !== undefined && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Database className="h-3 w-3" /> {node.sources} fontes
                            </span>
                        )}
                        <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-3 w-3" /></Button>
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="mt-1">
                        {node.children.map((child: any) => renderNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold tracking-tight">Árvore de Regiões</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Cadastre localidades e atrele fontes primárias para scrap de inteligência.</p>
                </div>
                <Button><Plus className="mr-2 h-4 w-4" /> Adicionar Região Raiz</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <Card className="lg:col-span-2 shadow-sm border-border/50">
                    <CardHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Estrutura Hierárquica</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder="Buscar região..." className="pl-9 h-9 text-sm" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-2 py-4">
                        {REGIONS_MOCK.map(rootNode => renderNode(rootNode))}
                    </CardContent>
                </Card>

                <Card className="bg-muted/30 border-dashed border-2 shadow-none">
                    <CardContent className="p-8 flex flex-col items-center justify-center text-center text-muted-foreground h-full min-h-[400px]">
                        <MapPin className="h-12 w-12 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-foreground mb-2">Detalhes da Região</h3>
                        <p className="text-sm">Selecione uma região na árvore ao lado para gerenciar suas fontes, jornais e páginas comunitárias atreladas.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
