'use client';

import { EventType, supabase, UserType } from '@/lib/utils';
import { User } from '@supabase/supabase-js';
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
    const [user, userDispatch] = useReducer(userReducer, null);
    const [userEvents, userEventsDispatch] = useReducer(
        userEventsReducer,
        null
    );

    async function setUpNewUser(user: User) {
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
    }

    // Return event ids.
    async function getEventsUserJoined(userId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('participant')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            alert('Error!');
            console.error(error);

            return [];
        }

        return data.map(({ event_id }) => event_id);
    }

    // Return event ids.
    async function getEventsUserStarted(email: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('event')
            .select('*')
            .eq('email', email);

        if (error) {
            alert('Error!');
            console.error(error);

            return [];
        }

        return data.map(({ id }) => id);
    }

    async function getEventsFromIds(ids: string[]): Promise<EventType[]> {
        const { data, error } = await supabase
            .from('event')
            .select('*')
            .in('id', ids);

        if (error) {
            alert('Error!');
            console.error(error);

            return [];
        }

        // Old events first.
        return data.sort(
            (a: { start_time: Date }, b: { start_time: Date }) =>
                new Date(a.start_time).getTime() -
                new Date(b.start_time).getTime()
        );
    }

    async function setUpReturnUser(user: UserType) {
        userDispatch({ user });

        const eventsUserJoined = await getEventsUserJoined(user.id);
        const eventsUserStarted = await getEventsUserStarted(user.email);
        const events = await getEventsFromIds([
            ...eventsUserJoined,
            ...eventsUserStarted,
        ]);

        userEventsDispatch({ userEvents: events });
    }

    async function setUp() {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
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
            setUpNewUser(user);
        } else {
            setUpReturnUser(data[0]);
        }
    }

    useEffect(() => {
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
