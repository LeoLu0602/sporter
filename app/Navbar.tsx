'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    // Navbar shouldn't show on welcome page.
    if (pathname === '/') {
        return <></>;
    }

    return (
        <nav>
            <ul className="fixed left-0 bottom-0 w-full h-12 flex">
                <li className="w-1/4">
                    <Link
                        className="h-full w-full flex justify-center items-center cursor-pointe"
                        href="/search"
                    >
                        <img className="h-4/5" src="/compass.svg" alt="" />
                    </Link>
                </li>
                <li className="w-1/4 flex justify-center items-center cursor-pointer">
                    <Link
                        className="h-full w-full flex justify-center items-center cursor-pointe"
                        href="/start"
                    >
                        <img className="h-4/5" src="/person-plus.svg" alt="" />
                    </Link>
                </li>
                <li className="w-1/4 flex justify-center items-center cursor-pointer">
                    <Link
                        className="h-full w-full flex justify-center items-center cursor-pointe"
                        href="/search"
                    >
                        <img className="h-4/5" src="/soccer.svg" alt="" />
                    </Link>
                </li>
                <li className="w-1/4 flex justify-center items-center cursor-pointer">
                    <Link
                        className="h-full w-full flex justify-center items-center cursor-pointe"
                        href="/profile"
                    >
                        <img className="h-4/5" src="/person.svg" alt="" />
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
