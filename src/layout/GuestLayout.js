import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { useUser } from '@/context/userContext';
import { Toaster } from '@/components/ui/toaster';

export default function GuestLayout({ children, head, className = '' }) {
    const { user } = useUser();

    return (
        <div className="px-20 py-10 mx-auto bg-gray-100 rounded-md shadow-md ">
            <Head>
                <title>{head}</title>
            </Head>
            <div className="flex flex-col w-full">
                <div className='flex items-center justify-between w-full px-10 py-2 mb-10 bg-white border rounded-md border-muted'>
                    <Link href={"/"}>
                        <Image alt='Swiftlead' className='mx-auto ' src="/images/logo.png" width={80} height={80} />
                    </Link>
                    {user ? (
                        <Link href={"/dashboard"} className="px-6 py-2 font-medium border rounded-md text-primary border-primary hover:bg-muted/90">
                            Beranda
                        </Link>
                    ) : (
                        <Link href={"/login"} className="px-6 py-2 font-medium text-white rounded-md bg-primary hover:bg-primary/90">
                            Masuk
                        </Link>
                    )}
                </div>

                <div className='min-h-screen '>
                    {children}
                </div>
            </div>
            <Toaster />
        </div>
    )
}