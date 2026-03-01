"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Home,
    Users,
    MapPin,
    Activity,
    Bell,
    FileCheck,
    LayoutDashboard,
    Radio
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MURAIS_ROUTES = [
    { href: "/redacao/murais/producao", label: "Em Produção", icon: Home },
    { href: "/redacao/murais/publicados", label: "Publicados", icon: LayoutDashboard },
];

const GERENCIAMENTO_ROUTES = [
    { href: "/redacao/eu-reporter", label: "Eu Repórter", icon: FileCheck, badge: 12 },
    { href: "/redacao/agentes", label: "Agentes", icon: Users },
    { href: "/redacao/regioes", label: "Regiões", icon: MapPin },
];

const ANALISE_ROUTES = [
    { href: "/redacao/analytics", label: "Analytics", icon: Activity },
    { href: "/redacao/alertas", label: "Alertas", icon: Bell, badge: 3, alert: true },
    { href: "/redacao/canais", label: "Canais", icon: Radio },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-full pt-4">
            <div className="px-6 pb-6">
                <h1 className="text-xl font-heading font-bold tracking-tight text-primary">FBR-Redacao</h1>
                <p className="text-xs text-muted-foreground mt-1">Painel Interno</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 px-3">
                <div>
                    <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Murais</h4>
                    <nav className="space-y-1">
                        {MURAIS_ROUTES.map((route) => (
                            <NavItem key={route.href} {...route} isActive={pathname === route.href} />
                        ))}
                    </nav>
                </div>

                <div>
                    <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Gerenciamento</h4>
                    <nav className="space-y-1">
                        {GERENCIAMENTO_ROUTES.map((route) => (
                            <NavItem key={route.href} {...route} isActive={pathname === route.href} />
                        ))}
                    </nav>
                </div>

                <div>
                    <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Análise</h4>
                    <nav className="space-y-1">
                        {ANALISE_ROUTES.map((route) => (
                            <NavItem key={route.href} {...route} isActive={pathname === route.href} />
                        ))}
                    </nav>
                </div>
            </div>

            <div className="p-4 mt-auto border-t border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    OP
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">Operador Local</span>
                    <span className="text-xs text-muted-foreground">Logado</span>
                </div>
            </div>
        </aside>
    );
}

function NavItem({ href, label, icon: Icon, badge, alert, isActive }: any) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                isActive ? "bg-muted text-foreground" : "text-muted-foreground"
            )}
        >
            <Icon className="h-4 w-4" />
            {label}
            {badge && (
                <Badge
                    variant={alert ? "destructive" : "secondary"}
                    className="ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
                >
                    {badge}
                </Badge>
            )}
        </Link>
    );
}
