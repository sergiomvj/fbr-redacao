export default function AlertasCentral() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-heading font-bold tracking-tight">Central de Alertas</h2>
                <p className="text-muted-foreground mt-1 text-sm">Intervenções de segurança e violação apontadas pela IA.</p>
            </div>
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
                Feed de Alertas Pending...
            </div>
        </div>
    );
}
