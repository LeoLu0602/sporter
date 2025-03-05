'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Navbar() {
    const pathname = usePathname();

    // Navbar shouldn't show on welcome page.
    if (pathname === '/') {
        return <></>;
    }

    return (
        <nav>
            <ul className="fixed left-0 bottom-0 w-full h-16 flex border-t-black border-[1px]">
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
                        href="/start"
                    >
                        {pathname === '/start' ? (
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
                        href="/event"
                    >
                        {pathname === '/event' ? (
                            <img
                                className="h-3/5"
                                src="/football-blue.svg"
                                alt=""
                            />
                        ) : (
                            <img className="h-3/5" src="/football.svg" alt="" />
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
