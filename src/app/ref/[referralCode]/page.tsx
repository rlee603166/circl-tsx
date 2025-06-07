'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ReferralPage() {
    const params = useParams();
    const router = useRouter();
    const referralCode = params?.referralCode as string;

    useEffect(() => {
        if (referralCode) {
            localStorage.setItem('waitlist_code', referralCode);
            router.push(`/?referralCode=${referralCode}`);
        }
    }, [referralCode, router]);

    return null;
}