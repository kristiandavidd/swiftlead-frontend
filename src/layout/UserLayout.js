import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/ui/sidebarAlt';
import Head from 'next/head';
import { useUser } from '@/context/userContext';
import { jwtDecode } from 'jwt-decode';

export default function UserLayout({ children, head, className = '' }) {

    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            router.push('/login');
            console.log('Token not found');
            return;
        }

        try {
            const { role } = jwtDecode(token); 
            if (role !== 0) {
                router.push('/admin');
            }
            setIsAuthorized(true);
        } catch (error) {
            console.log('Invalid token', error);
            router.push('/login'); 
        }
    }, [router]);

    if (!isAuthorized) {
        return null; 
    }

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