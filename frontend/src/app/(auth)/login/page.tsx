"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AutenticacaoLogin() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-muted/30">
            <div className="w-full max-w-md mx-auto relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-heading font-extrabold tracking-tight text-primary mb-2">FBR-Redacao</h1>
                    <p className="text-muted-foreground">Sistema Restrito a Operadores Facebrasil</p>
                </div>

                <Card className="border-border/50 shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">Entrar</CardTitle>
                        <CardDescription>Insira suas credenciais corporativas abaixo</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">E-mail Corporativo</Label>
                            <Input id="email" type="email" placeholder="operador@facebrasil.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" size="lg">Acessar Painel</Button>
                    </CardFooter>
                </Card>

                <p className="px-8 text-center text-sm text-muted-foreground mt-6">
                    Não tem acesso? Solicite ao administrador da rede.
                </p>
            </div>

            {/* Background Decorative Blur */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute bottom-[20%] right-[20%] w-[20vw] h-[20vw] rounded-full bg-destructive/5 blur-[80px]" />
            </div>
        </div>
    );
}
