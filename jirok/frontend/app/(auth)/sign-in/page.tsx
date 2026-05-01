"use client";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const formSchema = z.object({
  email: z.email(),
  password: z.string().trim().min(1, "Required"),
});

export default function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <>
    <Navbar/>
      <div className="flex items-start justify-center min-h-screen p-8">
        <Card className="w-full sm:w-[90%] md:w-[487px] shadow-lg rounded-lg">
          <CardHeader className="flex items-center justify-center text-center p-5">
            <CardTitle className="text-2xl">Welcome back!</CardTitle>
          </CardHeader>
          <div className="px-7">
            <Separator className="bg-gray-400" />
          </div>
          <CardContent className="p-7">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter email address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  disabled={false}
                  className="bg-blue-600 text-lg w-full hover:bg-blue-800"
                  size="lg"
                >
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
          <div className="px-7">
            <Separator className="bg-gray-400" />
          </div>
          <div className="px-7 flex items-center justify-center text-lg">
            or login with
          </div>
          <CardContent className="px-7">
            <Button
              variant="ghost"
              className="w-full bg-orange-300 hover:bg-orange-400 mb-3"
            >
              <Image
                src="/42icon.svg"
                width={500}
                height={500}
                alt="42 Icon"
                className="w-[30px]"
              />
            </Button>
          </CardContent>
          <div className="px-7">
            <Separator className="bg-gray-400" />
          </div>
          <CardContent className="px-7 py-1 flex items-center justify-center">
            <p>
              Don&apos;t have an account? &nbsp;
              <Link href="/sign-up">
                <span className="text-blue-700">Sign Up</span>
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
