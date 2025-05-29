

"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Download, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock auth hook for now - this would be replaced with actual auth logic
const useAuth = () => {
  return {
    loading: false,
    isAuthenticated: false,
    user: null,
    logout: () => console.log('logout')
  };
};

const UnauthenticatedButtons = ({ navigate }: { navigate: any }) => {
    const handleLogin = () => {
        navigate("/log-in");
    };

    const handleSignup = () => {
        navigate("/create-account");
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={handleLogin}
                className="px-5 py-2 bg-white text-gray-900 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors duration-200 text-sm font-light"
            >
                Log in
            </button>
            <button
                onClick={handleSignup}
                className="px-5 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors duration-200 text-sm font-light"
            >
                Sign up
            </button>
        </div>
    );
};

const AuthenticatedButtons = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
    const getInitials = (user: any) => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`;
        }
        if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return "U";
    };

    return (
        <>
            <Button variant="ghost" size="icon" className="neumorphic-button p-2 rounded-lg transition-all duration-200 hover:scale-105">
                <Search className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
            </Button>
            <Button variant="ghost" size="icon" className="neumorphic-button p-2 rounded-lg transition-all duration-200 hover:scale-105">
                <Download className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
            </Button>
            <div className="flex items-center gap-2">
                <div 
                    className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    title={user?.name || user?.email}
                >
                    {getInitials(user)}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="neumorphic-button p-2 rounded-lg transition-all duration-200 hover:scale-105"
                    onClick={onLogout}
                    title="Logout"
                >
                    <LogOut className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                </Button>
            </div>
        </>
    );
};

const LoadingButtons = () => (
    <div className="flex gap-3">
        <div className="px-5 py-2 bg-gray-200 rounded-full animate-pulse w-16 h-8"></div>
        <div className="px-5 py-2 bg-gray-200 rounded-full animate-pulse w-16 h-8"></div>
    </div>
);

export default function Header() {
    const navigate = useNavigate();
    const { loading, isAuthenticated, user, logout } = useAuth();

    return (
        <header className="fixed top-0 right-0 left-80 h-16 glass-effect border-b border-gray-200/30 z-30 flex items-center justify-between px-6 backdrop-blur-xl">
            <div 
                className="cursor-pointer flex items-center"
                onClick={() => navigate("/")}
            >
                <span className="text-2xl font-light text-gray-800 tracking-tight">circl.</span>
            </div>
            <div className="flex items-center gap-4">
                {loading ? (
                    <LoadingButtons />
                ) : isAuthenticated ? (
                    <AuthenticatedButtons user={user} onLogout={logout} />
                ) : (
                    <UnauthenticatedButtons navigate={navigate} />
                )}
            </div>
        </header>
    );
}

