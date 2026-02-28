import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface ArticleCardProps {
    title: string;
    excerpt: string;
    status: "classifying" | "writing" | "art" | "review";
    onClick?: () => void;
}

const statusConfig = {
    classifying: { label: "Classifying", color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20", pulse: false },
    writing: { label: "Writing Draft", color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20", pulse: true },
    art: { label: "Generating Art", color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20", pulse: true },
    review: { label: "Needs Review", color: "bg-destructive/10 text-destructive hover:bg-destructive/20", pulse: false },
};

export function ArticleCard({ title, excerpt, status, onClick }: ArticleCardProps) {
    const config = statusConfig[status];

    return (
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={onClick}>
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <Badge className={`${config.color} ${config.pulse ? 'animate-pulse' : ''}`}>
                        {config.label}
                    </Badge>
                    <Button variant="ghost" className="h-6 w-6 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                </div>
                <CardTitle className="text-sm mt-3 leading-snug">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground line-clamp-2">{excerpt}</p>
            </CardContent>
        </Card>
    );
}
