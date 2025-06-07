"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Search, Download, LogOut, User as UserIcon, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { PanelLeft } from "lucide-react";

import "./styles/Header.css";
import { User } from "@/types";

const UnauthenticatedButtons = () => {
    const router = useRouter();
    const handleLogin = () => {
        router.push("/welcome?mode=login");
    };

    const handleSignup = () => {
        router.push("/create-account");
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={handleLogin}
                className="px-5 py-2 bg-white text-gray-900 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors duration-200 text-sm"
            >
                Log in
            </button>
            <button
                onClick={handleSignup}
                className="px-5 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors duration-200 text-sm"
            >
                Sign up
            </button>
        </div>
    );
};

const AuthenticatedButtons = ({ user, onLogout }: { user: User | null; onLogout: () => void }) => {
    const getInitials = (user: User) => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`;
        }
        if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return "U";
    };

    const handleLogout = async () => {
        try {
            // Clear your custom JWT tokens
            onLogout();
            // Sign out from NextAuth (Google session)
            await signOut({ redirect: false });
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <>
            <Button variant="ghost" size="icon" className="header-button">
                <Search className="icon-small" />
            </Button>
            <Button variant="ghost" size="icon" className="header-button">
                <Download className="icon-small" />
            </Button>
            <div className="flex items-center gap-2">
                <div className="avatar" title={user?.firstName + " " + user?.lastName || user?.email}>
                    {getInitials(user as User)}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="header-button"
                    onClick={handleLogout}
                    title="Logout"
                >
                    <LogOut className="icon-small" />
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

export default function Header({ 
    isCollapsed, 
    setIsCollapsed, 
    createNewSession 
}: { 
    isCollapsed: boolean, 
    setIsCollapsed: (isCollapsed: boolean) => void,
    createNewSession: () => void }
) {
    const router = useRouter();
    const { loading, isAuthenticated, user, logout } = useAuth();

    return (
        <header className="chat-header responsive-header-bg">
            <div className={`logo-container ${isCollapsed ? "p-[11px]" : "p-[16px]"}`}>
                {isCollapsed && (
                    <div className="collapsed-buttons">
                        <div
                            className="hover:bg-[#ebebeb] focus:bg-[#ebebeb] cursor-pointer p-[4px] px-[6px] rounded-md"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            <PanelLeft className="w-5 h-6 text-gray-600" strokeWidth={2} />
                        </div>
                        <div
                            className="hover:bg-[#ebebeb] focus:bg-[#ebebeb] cursor-pointer p-[4px] px-[6px] rounded-md"
                            onClick={createNewSession}
                        >
                            <SquarePlus className="w-5 h-6 text-gray-600" strokeWidth={2} />
                        </div>
                    </div>
                )}
                <div 
                    className="app-title"
                    onClick={createNewSession}
                >
                    circl.
                </div>
            </div>
            <div className="header-actions">
                {loading ? (
                    <LoadingButtons />
                ) : isAuthenticated ? (
                    <AuthenticatedButtons user={user} onLogout={logout} />
                ) : (
                    <div className="auth-buttons">
                        <UnauthenticatedButtons />
                    </div>
                )}
            </div>
        </header>
    );
}
