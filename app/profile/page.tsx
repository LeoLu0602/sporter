'use client';

import { useEmail } from '@/context/Context';
import { supabase } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function Profile() {
    const email = useEmail();
    const router = useRouter();

    async function signOut() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            alert('Error!');
            console.error(error);
        } else {
            router.push('/');
        }
    }

    return (
        <>
            <main>
                <h1>👋 {email}</h1>
                <button onClick={signOut}>Sign out</button>
            </main>
        </>
    );
}
