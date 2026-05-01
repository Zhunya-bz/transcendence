'use client';
import Image from 'next/image';
import { Button } from "./ui/button";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
    const pathname = usePathname();

    return (<header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Link href="/">
                <Image
                src="/mascot-1.png"
                width={40}
                height={40}
                alt="Icon Jirok"
                />
                </Link>
                <span className="text-xl sm:text-2xl font-bold  text-gray-900">Jirok</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                {(pathname === '/' || pathname === '/sign-up') 
                    && (<Button variant='ghost' className="text-base sm:text-lg bg-orange-300 hover:bg-orange-400">
                        <Link href="/sign-in">Sign In</Link></Button>)}
                {(pathname === '/' || pathname === '/sign-in') 
                    && (<Button className="text-base sm:text-lg bg-blue-600 hover:bg-blue-800" >
                        <Link href="/sign-up">Sign Up</Link></Button>)}
            </div>
        </div>
    </header>
    );
}