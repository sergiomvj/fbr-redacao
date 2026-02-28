export default function AgentesGrid() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-heading font-bold tracking-tight">Gerenciamento de Agentes</h2>
                <p className="text-muted-foreground mt-1 text-sm">Monitore logs e ligue/desligue os módulos de inteligência artificial.</p>
            </div>
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
                Grid de Agentes Pending...
            </div>
        </div>
    );
}
