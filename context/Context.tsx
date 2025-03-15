'use client';

import { EventType, supabase, UserType } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import {
    createContext,
    Dispatch,
    useContext,
    useEffect,
    useReducer,
} from 'react';

const UserContext = createContext<UserType | null>(null);
const UserDispatchContext = createContext<Dispatch<{
    user: UserType | null;
}> | null>(null);
const UserEventsContext = createContext<EventType[] | null>(null);
const UserEventsDispatchContext = createContext<Dispatch<{
    userEvents: EventType[] | null;
}> | null>(null);

function userReducer(user: UserType | null, action: { user: UserType | null }) {
    return action.user;
}

function userEventsReducer(
    userEvents: EventType[] | null,
    action: { userEvents: EventType[] | null }
) {
    return action.userEvents;
}

export function useUser() {
    return useContext(UserContext);
}

export function useUserEvents() {
    return useContext(UserEventsContext);
}

export function useUserDispatch() {
    return useContext(UserDispatchContext);
}

export function useUserEventsDispatch() {
    return useContext(UserEventsDispatchContext);
}

export function Provider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, userDispatch] = useReducer(userReducer, null);
    const [userEvents, userEventsDispatch] = useReducer(
        userEventsReducer,
        null
    );

    useEffect(() => {
        async function setUp() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push('/');

                return;
            }

            const { data, error } = await supabase
                .from('user')
                .select('*')
                .eq('email', user.email);

            if (error) {
                alert('Error!');
                console.error(error);

                return;
            }

            if (data.length === 0) {
                // User hasn't registered.
                const { data, error } = await supabase
                    .from('user')
                    .insert([
                        {
                            email: user.email,
                            username: user.user_metadata.full_name,
                        },
                    ])
                    .select();

                if (error) {
                    alert('Error!');
                    console.error(error);

                    return;
                }

                userDispatch({
                    user: data[0],
                });
            } else {
                // User has registered.
                userDispatch({
                    user: data[0],
                });

                // Get the events user joined.
                const { data: data2, error: error2 } = await supabase
                    .from('participant')
                    .select('*')
                    .eq('user_id', data[0].id);

                if (error2) {
                    alert('Error!');
                    console.error(error2);

                    return;
                }

                // Get events user started.
                const { data: data3, error: error3 } = await supabase
                    .from('event')
                    .select('*')
                    .eq('email', data[0].email);

                if (error3) {
                    alert('Error!');
                    console.error(error3);

                    return;
                }

                const eventIds = [
                    ...data2.map(({ event_id }) => event_id),
                    ...data3.map(({ id }) => id),
                ];

                // Get events from event ids.
                const { data: data4, error: error4 } = await supabase
                    .from('event')
                    .select('*')
                    .in('id', eventIds);

                if (error4) {
                    alert('Error!');
                    console.error(error4);

                    return;
                }

                data4.sort(
                    (a: { start_time: Date }, b: { start_time: Date }) =>
                        new Date(a.start_time).getTime() -
                        new Date(b.start_time).getTime()
                );

                userEventsDispatch({ userEvents: data4 });
            }

            if (pathname === '/') {
                window.location.replace('/events');
            }
        }

        setUp();
    }, []);

    return (
        <UserContext.Provider value={user}>
            <UserDispatchContext.Provider value={userDispatch}>
                <UserEventsContext.Provider value={userEvents}>
                    <UserEventsDispatchContext.Provider
                        value={userEventsDispatch}
                    >
                        {children}
                    </UserEventsDispatchContext.Provider>
                </UserEventsContext.Provider>
            </UserDispatchContext.Provider>
        </UserContext.Provider>
    );
}
