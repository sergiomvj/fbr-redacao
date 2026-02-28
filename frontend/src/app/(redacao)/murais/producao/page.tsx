"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users, AlertCircle } from "lucide-react";
import { ArticleCard } from "@/components/murais/ArticleCard";
import { ArticleDrawer } from "@/components/murais/ArticleDrawer";
import { usePresence } from "@/hooks/usePresence";

const MOCK_DATA = {
    classifying: [
        { id: "1", title: "Prefeito de Boston anuncia novo fundo de apoio a empreendedores imigrantes", excerpt: "A nova dotação orçamentária visa fortalecer pequenos negócios locais...", status: "classifying" as const }
    ],
    writing: [
        { id: "2", title: "Como o novo centro comunitário afetará a região leste", excerpt: "Moradores estão divididos sobre o impacto no trânsito e na valorização imobiliária...", status: "writing" as const }
    ],
    art: [],
    review: [
        { id: "3", title: "Clima Extremo: Cuidados para dirigir na neve este fim de semana", excerpt: "Atenção motoristas: as estradas podem ficar escorregadias durante a madrugada...", status: "review" as const }
    ]
};

const MOCK_CONTENT = `
# Clima Extremo: Cuidados para dirigir na neve

As autoridades alertam para a **forte nevasca** prevista para este sábado à noite...

## Dicas da Polícia Rodoviária
1. Mantenha distância do veículo à frente.
2. Não faça movimentos bruscos no volante.
3. Teste os freios antes de acelerar em descidas.
`;

export default function MuralProducao() {
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
    const { activeUsers } = usePresence("mural-producao");

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold tracking-tight">Mural Em Produção</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Acompanhe e interfira no fluxo da inteligência artificial.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                        <Users className="h-4 w-4" />
                        <span>{activeUsers.length} online</span>
                    </div>
                    <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Atualizar</Button>
                    <Button>Nova Pauta Manual</Button>
                </div>
            </div>

            {/* Pipeline Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start overflow-x-auto pb-4">

                {/* Column 1: Collector */}
                <div className="space-y-4 min-w-[300px]">
                    <div className="flex items-center justify-between font-semibold px-1">
                        <div className="flex items-center gap-2">
                            <h3>Collector</h3>
                            <Badge variant="secondary">{MOCK_DATA.classifying.length}</Badge>
                        </div>
                    </div>
                    {MOCK_DATA.classifying.map(data => (
                        <ArticleCard
                            key={data.id}
                            {...data}
                            onClick={() => setSelectedArticleId(data.id)}
                        />
                    ))}
                </div>

                {/* Column 2: Journalist */}
                <div className="space-y-4 min-w-[300px]">
                    <div className="flex items-center justify-between font-semibold px-1">
                        <div className="flex items-center gap-2">
                            <h3>Journalist</h3>
                            <Badge variant="secondary">{MOCK_DATA.writing.length}</Badge>
                        </div>
                    </div>
                    {MOCK_DATA.writing.map(data => (
                        <div key={data.id} className="relative">
                            <div className="absolute inset-0 bg-emerald-500/5 animate-pulse rounded-xl pointer-events-none" />
                            <ArticleCard
                                {...data}
                                onClick={() => setSelectedArticleId(data.id)}
                            />
                        </div>
                    ))}
                </div>

                {/* Column 3: Art */}
                <div className="space-y-4 min-w-[300px]">
                    <div className="flex items-center justify-between font-semibold px-1">
                        <div className="flex items-center gap-2">
                            <h3>Art</h3>
                            <Badge variant="secondary">{MOCK_DATA.art.length}</Badge>
                        </div>
                    </div>
                    {MOCK_DATA.art.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg border-muted">
                            <p className="text-sm text-muted-foreground">Fila vazia.</p>
                        </div>
                    )}
                </div>

                {/* Column 4: Regional Editor (Review) */}
                <div className="space-y-4 min-w-[300px]">
                    <div className="flex items-center justify-between font-semibold px-1">
                        <div className="flex items-center gap-2">
                            <h3 className="flex items-center gap-2 text-destructive"><AlertCircle className="h-4 w-4" /> Requer Revisão</h3>
                            <Badge variant="destructive">{MOCK_DATA.review.length}</Badge>
                        </div>
                    </div>
                    {MOCK_DATA.review.map(data => (
                        <div key={data.id} className="ring-2 ring-destructive/50 rounded-xl overflow-hidden">
                            <ArticleCard
                                key={data.id}
                                {...data}
                                onClick={() => setSelectedArticleId(data.id)}
                            />
                        </div>
                    ))}
                </div>

            </div>

            <ArticleDrawer
                isOpen={!!selectedArticleId}
                onOpenChange={(open) => !open && setSelectedArticleId(null)}
                title="Clima Extremo: Cuidados para dirigir na neve"
                content={MOCK_CONTENT}
            />
        </div>
    );
}
