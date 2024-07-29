"use client";

import { providerMap } from "@/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { iconsProvider } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function SignInPage() {
  const params = useSearchParams();

  const [error, setError] = React.useState(() => params.get("error"));

  const handleSignin = async (provider: { id: any; name: any }) => {
    const result = await signIn(provider.id, {
      callbackUrl: process.env.NEXT_PUBLIC_DOMAIN_DEV,
    });
    if (result?.error) {
      setError(result?.error);
    }
  };

  const providerWithIcon = providerMap
    .filter((provider) => provider.id !== "credentials")
    .map((provider) => {
      const icon = iconsProvider.find((icn) => icn.id === provider.id)!.icon;
      return {
        ...provider,
        icon,
      };
    });

  return (
    <div className="flex flex-col gap-3 w-[350px]">
      <h1 className="text-3xl font-semibold mb-8">Sign in to your account</h1>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {Object.values(providerWithIcon).map((Provider) => (
        <Button
          className="flex items-center gap-3"
          variant="outline"
          key={Provider.id}
          onClick={() => handleSignin(Provider)}
        >
          <Provider.icon className="text-xl" /> Sign in with {Provider.name}
        </Button>
      ))}
    </div>
  );
}
