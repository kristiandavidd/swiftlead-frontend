import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layout/UserLayout';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import { IconUserCircle } from '@tabler/icons-react';

export default function Profile() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');

        router.push('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        if (!token) {
            router.push('/login');
        } else if (email) {
            setUserEmail(email);
        }
    }, [router]);

    return (
        <UserLayout head={"Profile"}>
            <div div className='flex flex-col w-full ' >
                <p className='text-lg font-semibold'>Profile</p>
                <p className='text-sm'>Personalize Account Settings and Manage User Access Securely.</p>
            </div >
            <Card className="flex flex-col items-center my-4">
                <CardHeader className="items-center w-full">
                    <Avatar className="w-20 h-20">
                        <AvatarImage src="" />
                        <AvatarFallback><IconUserCircle size={80} stroke={1.2} className='text-gray-200' /></AvatarFallback>
                    </Avatar>
                    {userEmail && (
                        <>
                            <p>Welcome!</p>
                            <p className='font-semibold text-md'>{userEmail}</p>
                        </>
                    )}
                </CardHeader>
                <CardFooter>
                    <Button onClick={handleLogout}>Logout</Button>
                </CardFooter>
            </Card>
        </UserLayout >
    );
}
