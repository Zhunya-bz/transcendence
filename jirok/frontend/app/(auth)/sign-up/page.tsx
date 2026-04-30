'use client';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function SignUp() {
    return (
        <>
        <Navbar/>
        <div className="flex items-start justify-center min-h-screen p-8">
        <Card className="w-full sm:w-[90%] md:w-[487px] shadow-lg rounded-lg">
            <CardHeader className="flex flex-col items-center justify-center text-center p-5">
                <CardTitle className="text-2xl">
                    Sign Up
                </CardTitle>
                <CardDescription>
                    By signin up, you agree to our {" "}
                    <Link href="/files/privacy-policy.txt">
                        <span className="text-blue-700">Privacy Policy</span>
                    </Link> {" "}
                    and {" "}
                    <Link href="/files/terms.txt">
                        <span className="text-blue-700">Terms of Service</span>
                    </Link>
                </CardDescription>
            </CardHeader>
            <div className="px-7">
                <Separator className="bg-blue-500"/>
            </div>
            <CardContent className="p-7">
                <form className="space-y-5">
                    <Input 
                        required
                        type="text"
                        value={""}
                        onChange={() => {}}
                        placeholder="Enter your name"
                        disabled={false}/>
                    <Input 
                        required
                        type="email"
                        value={""}
                        onChange={() => {}}
                        placeholder="Enter email address"
                        disabled={false}/>
                    <Input 
                        required
                        type="password"
                        value={""}
                        onChange={() => {}}
                        placeholder="Enter your password"
                        disabled={false}
                        min={8}
                        max={256}/>
                        <Button disabled={false} className="bg-blue-600 text-lg w-full hover:bg-blue-800" size="lg">
                            SignUp
                        </Button>
                </form>
            </CardContent>
            <div className="px-7 flex items-center justify-center text-lg">
                or signup with
                </div>
            <CardContent className="px-7">
                <Button variant='ghost' className="w-full bg-orange-300 hover:bg-orange-400 mb-3">
                    <Image src='/42icon.svg'
                    width={30}
                    height={30}
                    alt="42 Icon"/>
                </Button>
            </CardContent>
        </Card>
        </div>
        </>
    );
};