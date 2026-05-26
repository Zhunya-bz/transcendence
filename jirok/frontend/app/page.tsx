'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Image from 'next/image';

export default function Home() {
  return (
    <div className='flex min-h-full flex-1 flex-col bg-linear-to-br from-blue-100 via-white to-orange-100'>
      <Navbar/>
      <main className='mx-auto w-full max-w-7xl flex-1 px-6 py-16 md:py-24'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-12'>
          
          <div className='flex flex-col gap-6 md:w-1/2'>
            <h1 className='text-5xl font-extrabold text-slate-900 tracking-tight'>
              Organize your work, <span className='text-orange-500'>naturally.</span>
            </h1>
            <div className='flex flex-col gap-4 text-lg text-slate-600 leading-relaxed'>
              <p>
                Jirok is a simple and friendly tool to help you organize your work and stay on track. 
                Whether you're managing a project or working with a team, Jirok keeps everything clear.
              </p>
              <p>
                Create tasks, move them through stages, and see progress at a glance. 
                Focus on what matters without getting lost in complexity.
              </p>
            </div>
          </div>

          <div className='w-full md:w-1/2'>
            <div className='relative group'>
              {/* Decorative background glow */}
              <div className='absolute -inset-1 bg-linear-to-r from-blue-400 to-orange-400 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000'></div>
              
              <div className='relative bg-white rounded-lg shadow-2xl overflow-hidden'>
                <Image 
                  src='/image.webp' 
                  width={800} 
                  height={450} 
                  className='w-full h-auto object-cover'
                  alt="Jirok Tasks Table Dashboard" 
                  priority 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}