"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CreateAccountPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/welcome?mode=signup');
    }, [router]);
    return null;
}
