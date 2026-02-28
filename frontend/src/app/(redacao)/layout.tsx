import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function RedacaoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Sidebar - Fixed to the left */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <Header title="FBR-Redacao" />

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <div className="max-w-[1600px] mx-auto w-full h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
