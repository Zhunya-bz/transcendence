import NavbarDashboard from "@/components/NavbarDashboard";
import { Sidebar } from "@/components/Siderbar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({children} : DashboardLayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col">
            <NavbarDashboard />
            <div className="flex flex-1 overflow-hidden">
                <div className="hidden lg:block w-[264px] shrink-0 border-r border-neutral-200 overflow-y-auto">
                    <Sidebar />
                </div>
                <main className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="mx-auto w-full max-w-screen-2xl flex flex-col">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;