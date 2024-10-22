import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Sidebar from '@/components/ui/sidebarAlt';
import Head from 'next/head';

export default function UserLayout({ children, head, className = '' }) {
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className={`md:flex w-full ${className}`}>
            <Head>
                <title>{head}</title>
            </Head>

            <Sidebar />

            <div className='w-full min-h-screen p-8 bg-gray-100 md:p-12 lg:w-4/5'>
                {children}
            </div>
        </div>
    );
}