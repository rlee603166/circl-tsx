"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import { ENDPOINTS } from "@/api.config.js";

export const useAuth = () => {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [hasJWT, setHasJWT] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchJWT = async () => {
            try {
                if (
                    status === "authenticated" &&
                    session?.idToken &&
                    !localStorage.getItem("accessToken")
                ) {
                    console.log(JSON.stringify(session, null, 2));
                    const response = await fetch(`${ENDPOINTS.auth}/google/log-in`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ token: session.idToken }),
                    });

                    if (!response.ok) {
                        throw new Error("Authentication failed");
                    }

                    const { accessToken, refreshToken, user: userData } = await response.json();

                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);

                    console.log(JSON.stringify(userData, null, 2));
                    setHasJWT(true);
                    setUser(userData);
                } else if (localStorage.getItem("accessToken")) {
                    const token = localStorage.getItem("accessToken");
                    const response = await fetch(`${ENDPOINTS.auth}/validate`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setHasJWT(true);
                        setUser(userData);
                    } else {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        setHasJWT(false);
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error("Auth error:", error);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setHasJWT(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        if (status !== "loading") {
            fetchJWT();
        }
    }, [session, status]);

    const logout = () => {
        console.log("logging out")
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setHasJWT(false);
        setUser(null);

        signOut({ callbackUrl: "/" });
    };

    return {
        loading,
        hasJWT,
        user,
        session,
        isAuthenticated: hasJWT,
        logout,
    };
};
