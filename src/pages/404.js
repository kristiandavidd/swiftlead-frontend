import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/context/userContext';
import Image from 'next/image';

export default function Custom404() {
    const router = useRouter();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user !== undefined) {
            setIsLoading(false);

            if (!user) {
                console.log('User not found');
                router.push('/login');
            } else if (user.role === 1) {
                console.log('User is admin');
                router.push('/admin');
            } else {
                console.log('User is not admin');
                router.push('/dashboard');
            }
        }
    }, [router, user]);

    if (isLoading) {
        <div className='flex items-center justify-center w-full h-full'>
            <Image className='' alt='loading..' src={"/images/dots_2.gif"}></Image>
        </div>
    }

    return null;
}
