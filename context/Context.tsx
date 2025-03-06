'use client';

import { supabase } from '@/lib/utils';
import {
    createContext,
    Dispatch,
    useContext,
    useEffect,
    useReducer,
} from 'react';

const EmailContext = createContext<string | null>(null);
const EmailDispatchContext = createContext<Dispatch<{
    email: string | null;
}> | null>(null);

function emailReducer(email: string | null, action: { email: string | null }) {
    return action.email;
}

export function useEmail() {
    return useContext(EmailContext);
}

export function useEmailDispatch() {
    return useContext(EmailDispatchContext);
}

export function Provider({ children }: { children: React.ReactNode }) {
    const [auth, dispatch] = useReducer(emailReducer, null);

    useEffect(() => {
        async function setUp() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            dispatch({ email: user?.email ?? null });

            if (!user) {
                return;
            }

            const { data, error } = await supabase
                .from('profile')
                .select('email')
                .eq('email', user.email);

            if (error) {
                alert('Error!');
                console.error(error);

                return;
            }

            if (!data) {
                return;
            }

            if (data.length === 0) {
                const { error } = await supabase.from('profile').insert([
                    {
                        email: user.email,
                        username: user.user_metadata.full_name,
                    },
                ]);

                if (error) {
                    alert('Error!');
                    console.error(error);
                }
            }
        }

        setUp();
    }, []);

    return (
        <EmailContext.Provider value={auth}>
            <EmailDispatchContext.Provider value={dispatch}>
                {children}
            </EmailDispatchContext.Provider>
        </EmailContext.Provider>
    );
}
