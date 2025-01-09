import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { IconHome, IconCurrencyDollar, IconUser, IconFile } from '@tabler/icons-react';

export default function SidebarAdmin() {
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
                            <a href="/admin">
                                <div
                                    className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/admin' ? 'bg-tersier text-primary' : 'text-primary'
                                        }`}
                                >
                                    <IconHome size={20} stroke={1.5} /> Dashboard
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="/admin/user">
                                <div
                                    className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/admin/user' ? 'bg-tersier text-primary' : 'text-primary'
                                        }`}
                                >
                                    <IconUser size={20} stroke={1.5} /> User
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="/admin/transaction">
                                <div
                                    className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/admin/transaction' ? 'bg-tersier text-primary' : 'text-primary'
                                        }`}
                                >
                                    <IconCurrencyDollar size={20} stroke={1.5} /> Transaction
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="/admin/article">
                                <div
                                    className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/admin/article' ? 'bg-tersier text-primary' : 'text-primary'
                                        }`}
                                >
                                    <IconFile size={20} stroke={1.5} /> Article
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="/admin/profile">
                                <div
                                    className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/admin/profile' ? 'bg-tersier text-primary' : 'text-primary'
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
                                <a href="/admin">
                                    <div
                                        className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/admin' ? 'bg-tersier text-primary' : 'text-primary'
                                            }`}
                                    >
                                        <IconHome size={20} stroke={1.5} /> Dashboard
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/user">
                                    <div
                                        className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/admin/user' ? 'bg-tersier text-primary' : 'text-primary'
                                            }`}
                                    >
                                        <IconUser size={20} stroke={1.5} /> User
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/transaction">
                                    <div
                                        className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/admin/transaction' ? 'bg-tersier text-primary' : 'text-primary'
                                            }`}
                                    >
                                        <IconCurrencyDollar size={20} stroke={1.5} /> Transaction
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/article">
                                    <div
                                        className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/control' ? 'bg-tersier text-primary' : 'text-primary'
                                            }`}
                                    >
                                        <IconFile size={20} stroke={1.5} /> Article
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/profile">
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
