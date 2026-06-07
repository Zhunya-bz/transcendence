'use client';
import Image from 'next/image';
import { Button } from "./ui/button";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
    const pathname = usePathname();

    return (<header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
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
                <span className="text-xl sm:text-2xl font-bold text-foreground">Jirok</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <ThemeToggle />
                {(pathname === '/' || pathname === '/sign-up' || pathname === '/login-2fa' || pathname === '/setup-2fa')
                    && (<Button variant='ghost' className="text-base sm:text-lg bg-orange-300 hover:bg-orange-400">
                        <Link href="/sign-in">Sign In</Link></Button>)}
                {(pathname === '/' || pathname === '/sign-in' || pathname === '/login-2fa' || pathname === '/setup-2fa')
                    && (<Button className="text-base sm:text-lg bg-blue-600 hover:bg-blue-800" >
                        <Link href="/sign-up">Sign Up</Link></Button>)}
            </div>
        </div>
    </header>
    );
}
