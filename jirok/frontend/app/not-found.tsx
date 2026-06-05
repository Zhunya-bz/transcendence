import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      <main className="mx-auto flex h-full max-w-7xl items-center px-6 py-8 md:px-16 md:py-12 lg:px-24">
        <div className="flex w-full flex-col items-center justify-between gap-8 md:flex-row md:gap-12">
          <div className="flex flex-col gap-4 md:w-1/2 md:gap-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              404 <span className="text-orange-500">not found</span>
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              This page does not exist
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="ghost"
                size="lg"
                className="bg-orange-400 text-base text-white hover:bg-orange-300 sm:text-lg dark:bg-orange-500 dark:hover:bg-orange-400"
              >
                <Link href="/" className="text-white">
                  Back to home
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="bg-blue-600 text-base text-white hover:bg-blue-700 sm:text-lg dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                <Link href="/projects" className="text-white">
                  Back to projects
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden w-full justify-center md:flex md:w-1/2 md:justify-end">
            <div className="relative w-full max-w-45 sm:max-w-55 md:max-w-72 lg:max-w-96">
              <div className="relative h-auto">
                <Image
                  src="/sad-mascot.png"
                  width={800}
                  height={800}
                  className="h-auto w-full object-contain"
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
