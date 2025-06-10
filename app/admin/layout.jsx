
import Sidebar from "@/components/Admin/Sidebar";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
    const session = await auth();

    if (!session) {
        return redirect("/login");
    } else if (session?.user?.role !== "admin") {
        return redirect("/");
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Admin Header */}
                <header className="bg-white border-b border-gray-200">
                    <div className="flex justify-between items-center px-8 py-5">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold tracking-tight">INKWELL ADMIN</h2>
                            <span className="bg-black text-white text-xs px-2 py-0.5 rounded-sm">PRO</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/" target="_blank" className="text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-1">
                                <span>Visit Site</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </Link>

                            {/* User Menu */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-medium text-lg">
                                    A
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium">Admin User</p>
                                    <p className="text-xs text-gray-500">admin@inkwell.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto px-8 py-8 bg-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}