'use client';
import { z } from "zod";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import { Separator } from "@/components/ui/separator";
import {useForm} from "react-hook-form";
import {zodResolver} from '@hookform/resolvers'

const formSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
})


export default function SignIn() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "", 
            password: "",
        },
    });

    return (
        <>
        <Navbar/>
        <div className="flex items-start justify-center min-h-screen p-8">
        <Card className="w-full sm:w-[90%] md:w-[487px] shadow-lg rounded-lg">
            <CardHeader className="flex items-center justify-center text-center p-5">
                <CardTitle className="text-2xl">
                    Welcome back!
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <Separator className="bg-blue-500"/>
            </div>
            <CardContent className="p-7">
                <Form></Form>
                <form className="space-y-5">
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
                            Login
                        </Button>
                </form>
            </CardContent>
            <div className="px-7 flex items-center justify-center text-lg">
                or login with
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