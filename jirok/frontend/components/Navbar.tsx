'use client';
import Image from 'next/image';
import { Button } from "./ui/button";

export default function Navbar() {
    return (<header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Image
                src="/mascot-1.png"
                width={8}
                height={8}
                alt="Icon Jirok"
                />
                {/* <img className='h-8 w-8 sm:h-8 sm:w-8 text-blue-600' src='/mascot-1.png'></img> */}
                <span className="text-xl sm:text-2xl font-bold  text-gray-900">Jiro</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <Button variant='ghost' size='sm' className="text-base sm:text-lg">Sign In</Button>
                <Button className="text-base sm:text-lg bg-blue-600 hover:bg-blue-800" size='sm' >Sign Up</Button>
            </div>
        </div>
    </header>
    );
}