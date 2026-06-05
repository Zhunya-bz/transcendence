"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { Separator } from "@/components/ui/separator";

import { enable2FA, generate2FA } from "@/actions/2fa";

const otpSchema = z
  .string()
  .length(6, "OTP must be 6 digits")
  .regex(/^\d+$/, "OTP must contain only numbers");

export default function Setup2FA() {
  const router = useRouter();

  const [otp, setOtp] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["2fa-qr"],
    queryFn: generate2FA,
    retry: false,
  });
  console.log("2FA QR code data:", data);

  const enableMutation = useMutation({
    mutationFn: enable2FA,
    onSuccess: () => {
      toast.success("2FA enabled successfully");
      router.replace("/projects");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    const parsed = otpSchema.safeParse(otp);

    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    enableMutation.mutate(otp);
  };
  

  return (
    <>
      <Navbar />

      <div className="flex justify-center min-h-screen p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Set Up Two-Factor Authentication</CardTitle>
            <CardDescription>
              Scan the QR code using Google Authenticator or Authy and enter
              the 6-digit code below.
            </CardDescription>
          </CardHeader>

          <div className="px-6">
            <Separator />
          </div>

          <CardContent className="space-y-6 pt-6">
            {isLoading && (
              <div className="text-center">
                Generating QR Code...
              </div>
            )}

            {isError && (
              <div className="text-center text-red-500">
                Failed to load QR code. Here is secret code {" "}
                {data?.secret ?? "Unavailable"}
              </div>
            )}

            {data && (
              <>
                <div className="flex justify-center">
                  <img
                    src={data.qrCodeDataUrl}
                    alt="2FA QR Code"
                    className="w-64 h-64 border rounded-lg"
                  />
                </div>

                <Input
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleSubmit}
                  disabled={enableMutation.isPending}
                >
                  {enableMutation.isPending
                    ? "Verifying..."
                    : "Enable 2FA"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}