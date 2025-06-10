'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function withAdminAuth(WrappedComponent) {
    return function ProtectedRoute(props) {
        const { data: session, status } = useSession();
        const router = useRouter();

        useEffect(() => {
            if (status === 'loading') return;

            if (!session) {
                router.replace('/login');
                return;
            }

            if (session?.user?.role !== 'admin') {
                router.replace('/');
            }
        }, [session, status, router]);

        if (status === 'loading') {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            );
        }

        if (!session || session?.user?.role !== 'admin') {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
} 