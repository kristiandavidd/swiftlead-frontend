import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { IconHome, IconChartDots3, IconUser, IconFeather } from '@tabler/icons-react';

export default function Sidebar() {
    const router = useRouter();

    return (
        <>
            <div className="hidden w-1/5 text-white md:flex-col md:bg-white md:h-screen md:flex">
                <div className="flex items-center justify-center p-6 pt-12">
                    <Image src="/images/logo.png" alt="Logo" width={120} height={120} />
                </div>

                <nav className="px-10 py-12">
                    <ul className='flex flex-col gap-4 '>
                        <li>
                            <a href="/dashboard">
                                <div
                                    className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/dashboard' ? 'bg-tersier text-primary' : 'text-primary'
                                        }`}
                                >
                                    <IconHome size={20} stroke={1.5} /> Dashboard
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="/control">
                                <div
                                    className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/control' ? 'bg-tersier text-primary' : 'text-primary'
                                        }`}
                                >
                                    <IconChartDots3 size={20} stroke={1.5} /> Control
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="/harvest">
                                <div
                                    className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/harvest' ? 'bg-tersier text-primary' : 'text-primary'
                                        }`}
                                >
                                    <IconFeather size={20} stroke={1.5} /> Harvest
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="/profile">
                                <div
                                    className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/profile' ? 'bg-tersier text-primary' : 'text-primary'
                                        }`}
                                >
                                    <IconUser size={20} stroke={1.5} /> Profile
                                </div>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className='fixed bottom-0 left-0 right-0 z-20 md:hidden '>
                <div className='flex items-center justify-center bg-white border border-muted rounded-t-md'>
                    <nav className="px-10 py-4">
                        <ul className='flex gap-4 '>
                            <li>
                                <a href="/dashboard">
                                    <div
                                        className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/dashboard' ? 'bg-tersier text-primary' : 'text-primary'
                                            }`}
                                    >
                                        <IconHome size={20} stroke={1.5} /> Dashboard
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="/control">
                                    <div
                                        className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/control' ? 'bg-tersier text-primary' : 'text-primary'
                                            }`}
                                    >
                                        <IconChartDots3 size={20} stroke={1.5} /> Control
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="/profile">
                                    <div
                                        className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/profile' ? 'bg-tersier text-primary' : 'text-primary'
                                            }`}
                                    >
                                        <IconUser size={20} stroke={1.5} /> Profile
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}
