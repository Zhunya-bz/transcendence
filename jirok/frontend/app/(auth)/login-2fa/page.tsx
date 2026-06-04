"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Navbar from "@/components/Navbar";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { verify2FA } from "@/actions/2fa";

export default function Verify2FA() {
  const router = useRouter();

  const [code, setCode] = useState("");

  const mutation = useMutation({
    mutationFn: verify2FA,

    onSuccess: () => {
      toast.success("Login successful");
      router.replace("/projects");
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (code.length !== 6) {
      toast.error("Enter a valid 6-digit code");
      return;
    }

    mutation.mutate(code);
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center min-h-auto p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Two-Factor Authentication</CardTitle>

            <CardDescription>
              Enter the 6-digit code from your authenticator app.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              maxLength={6}
              placeholder="123456"
              className="text-center text-lg tracking-widest"
            />

            <Button
              className="w-full  bg-blue-600 hover:bg-blue-700 text-white"
              disabled={mutation.isPending}
              onClick={handleSubmit}
            >
              {mutation.isPending
                ? "Verifying..."
                : "Verify"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}