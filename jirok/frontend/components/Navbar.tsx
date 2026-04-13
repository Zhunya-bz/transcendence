'use client';

export default function Navbar() {
    return (<header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <img className='h-6 w-6 sm:h-6 sm:w-6 text-blue-600' src='https://upload.wikimedia.org/wikipedia/commons/a/a3/Wikipedia-logo-v2-square.svg'></img>
                <span className="text-xl sm:text-2xl font-bold  text-gray-900">Jirok</span>
            </div>
        </div>
    </header>
    );
}