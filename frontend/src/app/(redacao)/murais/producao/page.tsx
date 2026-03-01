"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users, AlertCircle } from "lucide-react";
import { ArticleCard } from "@/components/murais/ArticleCard";
import { ArticleDrawer } from "@/components/murais/ArticleDrawer";
import { usePresence } from "@/hooks/usePresence";

type ArticlePipelineData = {
    classifying: any[];
    writing: any[];
    art: any[];
    review: any[];
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
    const [pipelineData, setPipelineData] = useState<ArticlePipelineData>({
        classifying: [],
        writing: [],
        art: [],
        review: []
    });
    const [loading, setLoading] = useState(true);

    const fetchPipelineData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/proxy/articles/production");
            if (res.ok) {
                const data = await res.json();
                // Map API fields ('body' -> 'excerpt') for the Card UI if needed, or backend can return 'excerpt'
                const mapExcerpt = (arr: any[]) => arr.map(a => ({ ...a, excerpt: a.body ? a.body.substring(0, 100) + '...' : '' }));
                setPipelineData({
                    classifying: mapExcerpt(data.classifying || []),
                    writing: mapExcerpt(data.writing || []),
                    art: mapExcerpt(data.art || []),
                    review: mapExcerpt(data.review || [])
                });
            }
        } catch (error) {
            console.error("Failed to fetch pipeline data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPipelineData();
    }, []);

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
                    <Button variant="outline" onClick={fetchPipelineData} disabled={loading}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar
                    </Button>
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
                            <Badge variant="secondary">{pipelineData.classifying.length}</Badge>
                        </div>
                    </div>
                    {pipelineData.classifying.map(data => (
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
                            <Badge variant="secondary">{pipelineData.writing.length}</Badge>
                        </div>
                    </div>
                    {pipelineData.writing.map(data => (
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
                            <Badge variant="secondary">{pipelineData.art.length}</Badge>
                        </div>
                    </div>
                    {pipelineData.art.length === 0 && (
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
                            <Badge variant="destructive">{pipelineData.review.length}</Badge>
                        </div>
                    </div>
                    {pipelineData.review.map(data => (
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
