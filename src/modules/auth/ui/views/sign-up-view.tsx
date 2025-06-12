"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { OctagonAlertIcon } from "lucide-react";
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  confirmPassword: z.string().min(1, { message: "Confirm password is required" })

})
.refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match"
})

export const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:"",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);
    authClient.signUp.email(
      { name: data.name,
        
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setPending(false);
          if (error?.error?.field && error?.error?.message) {
            form.setError(error.error.field, { message: error.error.message });
          } else {
            setError(
              error?.error?.message ||
              error?.message ||
              "An unknown error occurred. Please try again."
            );
          }
        }
      }
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-50">
      <div className="flex-1 flex justify-center items-center p-6">
        <img src="/logo.svg" alt="App Logo" className="w-40 h-40 object-contain" />
      </div>
      <Card className="flex-1 w-full max-w-md mx-auto mt-10 md:mt-0 p-6">
        <CardContent>
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>
          {error && Object.keys(form.formState.errors).length === 0 && (
            <Alert variant="destructive" className="flex items-center gap-2">
              <OctagonAlertIcon className="text-destructive" />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </Form>
          <div className="flex flex-col gap-2">
            <Button type="button" variant="outline" className="w-full" disabled={pending}>
              Sign up with Google
            </Button>
            <Button type="button" variant="outline" className="w-full" disabled={pending}>
              Sign up with GitHub
            </Button>
          </div>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="text-primary underline hover:no-underline">
              Sign in
            </Link>
          </div>
          <div className="text-xs text-muted-foreground text-center mt-2">
            By signing up, you agree to our Terms and Conditions.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}