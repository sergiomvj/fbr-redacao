import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Play, Pause, RefreshCw } from "lucide-react";

export default function MuralProducao() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-heading font-bold tracking-tight">Mural Em Produção</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Acompanhe e interfira no fluxo da inteligência artificial.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Atualizar</Button>
                    <Button>Nova Pauta Manual</Button>
                </div>
            </div>

            {/* Pipeline Columns Concept */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">

                {/* Column 1: Collector */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between font-semibold px-1">
                        <div className="flex items-center gap-2">
                            <h3>Collector</h3>
                            <Badge variant="secondary">3</Badge>
                        </div>
                    </div>

                    {/* Article Card Mock */}
                    <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                        <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                                <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Classifying</Badge>
                                <Button variant="ghost" className="h-6 w-6 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                            </div>
                            <CardTitle className="text-sm mt-3 leading-snug">
                                Prefeito de Boston anuncia novo fundo de apoio a empreendedores imigrantes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-xs text-muted-foreground line-clamp-2">A nova dotação orçamentária visa fortalecer pequenos negócios locais liderados por minorias...</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Column 2: Journalist */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between font-semibold px-1">
                        <div className="flex items-center gap-2">
                            <h3>Journalist</h3>
                            <Badge variant="secondary">1</Badge>
                        </div>
                    </div>

                    {/* Article Card Mock */}
                    <Card className="cursor-pointer border-primary/20 bg-primary/5">
                        <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                                <Badge className="animate-pulse bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">Writing Draft</Badge>
                            </div>
                            <CardTitle className="text-sm mt-3 leading-snug">
                                Como o novo centro comunitário afetará a região leste
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="flex items-center gap-2 mt-4">
                                <Button variant="outline" size="sm" className="h-7 text-xs w-full"><Pause className="mr-1 h-3 w-3" /> Pausar</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Column 3: Art */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between font-semibold px-1">
                        <div className="flex items-center gap-2">
                            <h3>Art</h3>
                            <Badge variant="secondary">0</Badge>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg border-muted">
                        <p className="text-sm text-muted-foreground">Nenhum artigo aguardando artes gráficas.</p>
                    </div>
                </div>

                {/* Column 4: Regional Editor */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between font-semibold px-1">
                        <div className="flex items-center gap-2">
                            <h3>Editorização Regional</h3>
                            <Badge variant="secondary">2</Badge>
                        </div>
                    </div>

                    <Card className="cursor-pointer border-destructive/20 bg-destructive/5">
                        <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                                <Badge variant="destructive">Needs Review</Badge>
                            </div>
                            <CardTitle className="text-sm mt-3 leading-snug">
                                Clima Extremo: Cuidados para dirigir na neve este fim de semana
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-xs text-muted-foreground mt-1 mb-4">A Inteligência Artificial solicitou intervenção humana por inconsistência no tom.</p>
                            <div className="flex items-center gap-2">
                                <Button size="sm" className="h-7 text-xs w-full">Corrigir Agora</Button>
                            </div>
                        </CardContent>
                    </Card>

                </div>

            </div>
        </div>
    );
}
