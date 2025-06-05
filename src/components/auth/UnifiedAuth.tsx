"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClientSafeProvider, getProviders, LiteralUnion, signIn } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";

export default function UnifiedAuth({ initialMode = "login" }) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);
    const [isLogin, setIsLogin] = useState(initialMode === "login");

    useEffect(() => {
        getProviders().then(prov => setProviders(prov));
    }, []);

    const handleEmailSubmit = () => {
        console.log("Email submitted:", email);
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="cursor-pointer absolute top-5 left-7" onClick={() => router.push("/")}>
                <h1 className="text-2xl font-bold text-black">circl.</h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-5 py-10">
                <div className="w-full sm:w-[440px] max-w-xs">
                    {/* Welcome Title with smooth transition */}
                    <div className="h-8 mb-8 flex items-center justify-center">
                        <h2 className="text-2xl font-normal text-center text-gray-900 transition-all duration-300 ease-in-out">
                            {isLogin ? "Welcome back" : "Create an account"}
                        </h2>
                    </div>

                    {/* Email Form */}
                    <div className="space-y-4 mb-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm mb-2 text-left"
                                style={{ color: "#21B8CD" }}
                            >
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                                style={{ ["--tw-ring-color" as string]: "#21B8CD" }}
                                onFocus={e => (e.target.style.boxShadow = "0 0 0 2px #21B8CD")}
                                onBlur={e => (e.target.style.boxShadow = "none")}
                                placeholder=""
                            />
                        </div>

                        <button
                            onClick={handleEmailSubmit}
                            className="cursor-pointer w-full text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
                            style={{ backgroundColor: "#21B8CD" }}
                            onMouseEnter={e => ((e.target as HTMLElement).style.backgroundColor = "#1a9bb0")}
                            onMouseLeave={e => ((e.target as HTMLElement).style.backgroundColor = "#21B8CD")}
                        >
                            Continue
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">OR</span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    {providers &&
                        Object.values(providers).map(provider => (
                            <div key={provider.name} className="space-y-3 mb-6">
                                <button
                                    onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                                    className="cursor-pointer w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span className="text-gray-700 font-medium">
                                        Continue with {provider.name}
                                    </span>
                                </button>
                            </div>
                        ))}

                    {/* Toggle link with smooth transition */}
                    <div className="h-6 mb-6 flex items-center justify-center">
                        <p className="text-sm text-gray-600 transition-all duration-300 ease-in-out">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <a 
                                onClick={toggleMode}
                                onMouseDown={(e) => e.preventDefault()} 
                                className="hover:underline cursor-pointer transition-all duration-300 ease-in-out" 
                                style={{ color: "#21B8CD" }}
                            >
                                {isLogin ? "Sign up" : "Log in"}
                            </a>
                        </p>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-8 flex justify-center space-x-4 text-sm text-gray-500">
                        <a href="#" className="hover:underline">
                            Terms of Use
                        </a>
                        <span>|</span>
                        <a href="#" className="hover:underline">
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
