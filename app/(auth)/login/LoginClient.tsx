'use client';
import { useForm } from 'react-hook-form';
import { api } from '@/app/lib/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function LoginClient() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const router = useRouter();

    const onSubmit = async (data: any) => {
        try {
            const res = await api.post('/auth/login', data);
            if (res.data.success) {
                Cookies.set('accessToken', res.data.data.accessToken);
                toast.success("Welcome back!", {
                  description: "You have successfully logged in.",
                });
                router.push('/dashboard');
            }
        } catch (error: any) {
             toast.error("Login Failed", {
                  description: error.response?.data?.message || 'Something went wrong.',
             });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
             <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">Sign in</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and password to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="Enter Your Email" 
                                {...register('email', { required: true })}
                            />
                            {errors.email && <span className="text-red-500 text-xs">Email is required</span>}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/forgot-password" className="text-xs text-primary hover:text-primary/80">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input 
                                id="password" 
                                type="password" 
                                {...register('password', { required: true })}
                                placeholder="Enter Your Password"
                            />
                            {errors.password && <span className="text-red-500 text-xs">Password is required</span>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
                            Register
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
