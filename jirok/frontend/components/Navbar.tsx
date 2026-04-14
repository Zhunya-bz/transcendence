'use client';
import Image from 'next/image';
import { Button } from "./ui/button";

export default function Navbar() {
    return (<header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Image
                src="/mascot-1.png"
                width={40}
                height={40}
                alt="Icon Jirok"
                />
                <span className="text-xl sm:text-2xl font-bold  text-gray-900">Jirok</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <Button variant='ghost' size='sm' className="text-base sm:text-lg hover:bg-orange-300">Sign In</Button>
                <Button className="text-base sm:text-lg bg-blue-400 hover:bg-blue-600" size='sm' >Sign Up</Button>
            </div>
        </div>
    </header>
    );
}