'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    // Navbar shouldn't show on welcome/setup page.
    if (pathname === '/' || pathname === '/setup') {
        return <></>;
    }

    return (
        <nav>
            <ul className="fixed z-30 left-0 bottom-0 w-full h-12 flex bg-white opacity-90">
                <li className="w-1/4">
                    <Link
                        className="h-full w-full flex justify-center items-center cursor-pointe"
                        href="/search"
                    >
                        {pathname === '/search' ? (
                            <img
                                className="h-3/5"
                                src="/compass-fill.svg"
                                alt=""
                            />
                        ) : (
                            <img className="h-3/5" src="/compass.svg" alt="" />
                        )}
                    </Link>
                </li>
                <li className="w-1/4 flex justify-center items-center cursor-pointer">
                    <Link
                        className="h-full w-full flex justify-center items-center cursor-pointe"
                        href="/new"
                    >
                        {pathname === '/new' ? (
                            <img
                                className="h-3/5"
                                src="/person-plus-fill.svg"
                                alt=""
                            />
                        ) : (
                            <img
                                className="h-3/5"
                                src="/person-plus.svg"
                                alt=""
                            />
                        )}
                    </Link>
                </li>
                <li className="w-1/4 flex justify-center items-center cursor-pointer">
                    <Link
                        className="h-full w-full flex justify-center items-center cursor-pointe"
                        href="/events"
                    >
                        {pathname === '/events' ? (
                            <img
                                className="h-3/5"
                                src="/football-fill.png"
                                alt=""
                            />
                        ) : (
                            <img className="h-3/5" src="/football.png" alt="" />
                        )}
                    </Link>
                </li>
                <li className="w-1/4 flex justify-center items-center cursor-pointer">
                    <Link
                        className="h-full w-full flex justify-center items-center cursor-pointe"
                        href="/profile"
                    >
                        {pathname === '/profile' ? (
                            <img
                                className="h-3/5"
                                src="/person-fill.svg"
                                alt=""
                            />
                        ) : (
                            <img className="h-3/5" src="/person.svg" alt="" />
                        )}
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
