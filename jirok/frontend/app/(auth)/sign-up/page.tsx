"use client";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export default function SignUp() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <>
      <Navbar />
      <div className="flex items-start justify-center min-h-screen p-8">
        <Card className="w-full sm:w-[90%] md:w-[487px] shadow-lg rounded-lg">
          <CardHeader className="flex flex-col items-center justify-center text-center p-5">
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              By signin up, you agree to our{" "}
              <Link href="/files/privacy-policy.txt">
                <span className="text-blue-700">Privacy Policy</span>
              </Link>{" "}
              and{" "}
              <Link href="/files/terms.txt">
                <span className="text-blue-700">Terms of Service</span>
              </Link>
            </CardDescription>
          </CardHeader>
          <div className="px-7">
            <Separator className="bg-blue-500" />
          </div>
          <CardContent className="p-7">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  Register
                </Button>
              </form>
            </Form>
          </CardContent>
          <div className="px-7 flex items-center justify-center text-lg">
            or register with
          </div>
          <CardContent className="px-7">
            <Button
              variant="ghost"
              className="w-full bg-orange-300 hover:bg-orange-400 mb-3"
            >
              <Image src="/42icon.svg" width={30} height={30} alt="42 Icon" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
