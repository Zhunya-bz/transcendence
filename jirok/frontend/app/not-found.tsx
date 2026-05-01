import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-950 via-blue-900 to-slate-950 text-white">
      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 lg:px-16 xl:px-24 lg:py-28">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-6 md:w-1/2">
            <h1 className="text-5xl font-extrabold tracking-tight">
              404 <span className="text-orange-400">not found</span>
            </h1>
            <p className="text-lg text-blue-100/80 leading-relaxed">
              This page does not exist
            </p>
            <div>
              <Button
                variant="ghost"
                size="lg"
                className="text-base sm:text-lg bg-orange-400 hover:bg-orange-300"
              >
                <Link href="/" className="text-black">
                  Back to home
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex w-full justify-center md:w-1/2 md:justify-end">
            <div className="relative w-full max-w-xs sm:max-w-sm">
              <div className="relative h-auto">
                <Image
                  src="/sad-mascot.png"
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover"
                  alt="Sad mascot"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
