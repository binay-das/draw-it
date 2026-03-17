"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

export default function SignupPage() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("/api/auth/signup", {
                name,
                email,
                password,
            });

            const data = await response.data;

            if (response.status === 200) {
                router.push("/signin");
            }
        } catch (err) {
            setError("Failed to sign up. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] px-4 transition-colors">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] p-8 rounded-2xl shadow-xl dark:shadow-2xl backdrop-blur-sm transition-colors">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Create an account</h1>
                        <p className="text-gray-500 dark:text-gray-400 transition-colors">Join Draw-It and start sketching today</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 transition-colors">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-gray-50 dark:bg-[#2a2a2a] border-gray-200 dark:border-[#444] text-gray-900 dark:text-white focus-visible:ring-blue-500 h-12 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 transition-colors">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-gray-50 dark:bg-[#2a2a2a] border-gray-200 dark:border-[#444] text-gray-900 dark:text-white focus-visible:ring-blue-500 h-12 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 transition-colors">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-gray-50 dark:bg-[#2a2a2a] border-gray-200 dark:border-[#444] text-gray-900 dark:text-white focus-visible:ring-blue-500 h-12 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Sign up"
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-gray-500 dark:text-gray-400 transition-colors">
                        Already have an account?{" "}
                        <Link href="/signin" className="text-blue-600 dark:text-blue-500 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
