'use client';

import { calculateAge, EventType, supabase, UserType } from '@/lib/utils';
import { User } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
import {
    createContext,
    Dispatch,
    useContext,
    useEffect,
    useReducer,
} from 'react';

// null: state is not yet determined.
const UserContext = createContext<UserType | null>(null);
const UserDispatchContext = createContext<Dispatch<{
    user: UserType | null;
}> | null>(null);
const UserEventsContext = createContext<EventType[] | null>(null);
const SearchResultsContext = createContext<EventType[] | null>(null);

function userReducer(user: UserType | null, action: { user: UserType | null }) {
    return action.user;
}

function userEventsReducer(
    userEvents: EventType[] | null,
    action: { userEvents: EventType[] | null }
) {
    return action.userEvents;
}

function searchResultsReducer(
    searchResults: EventType[] | null,
    action: { searchResults: EventType[] | null }
) {
    return action.searchResults;
}

export function useUser() {
    return useContext(UserContext);
}

export function useUserDispatch() {
    return useContext(UserDispatchContext);
}

export function useUserEvents() {
    return useContext(UserEventsContext);
}

export function useSearchResults() {
    return useContext(SearchResultsContext);
}

export function Provider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, userDispatch] = useReducer(userReducer, null);
    const [userEvents, userEventsDispatch] = useReducer(
        userEventsReducer,
        null
    );
    const [searchResults, searchResultsDispatch] = useReducer(
        searchResultsReducer,
        null
    );

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

    async function setUpSearchResults(user: UserType, userEvents: EventType[]) {
        if (!('geolocation' in navigator)) {
            alert('Geolocation is not available');

            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { data, error } = await supabase.rpc('filter_events', {
                user_lat: position.coords.latitude,
                user_lng: position.coords.longitude,
                d: user.distance,
                user_gender: user.gender,
                user_age: user.birthday ? calculateAge(user.birthday) : 20,
                user_soccer_level: user.soccer_level,
                user_basketball_level: user.basketball_level,
                user_tennis_level: user.tennis_level,
                user_table_tennis_level: user.table_tennis_level,
                user_badminton_level: user.badminton_level,
                user_time: new Date().toISOString(),
            });

            if (error) {
                alert('Error!');
                console.error(error);

                return;
            }

            // Old events first.
            // Filter out events that the user has already joined.
            searchResultsDispatch({
                searchResults: data
                    .sort(
                        (a: { start_time: Date }, b: { start_time: Date }) =>
                            new Date(a.start_time).getTime() -
                            new Date(b.start_time).getTime()
                    )
                    .filter(
                        ({ id }: { id: string }) =>
                            !new Set(userEvents.map(({ id }) => id)).has(id)
                    ),
            });
        });
    }

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

        userDispatch({ user: data[0] });
        userEventsDispatch({ userEvents: [] });
        setUpSearchResults(data[0], []);
    }

    async function setUpReturnUser(user: UserType) {
        const eventsUserJoined = await getEventsUserJoined(user.id);
        const eventsUserStarted = await getEventsUserStarted(user.email);
        const userEvents = await getEventsFromIds([
            ...eventsUserJoined,
            ...eventsUserStarted,
        ]);

        userDispatch({ user });
        userEventsDispatch({ userEvents });
        setUpSearchResults(user, userEvents);
    }

    async function setUp() {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // Not signed in & not in the welcome page -> redirect to the welcome page
        if (!user) {
            if (pathname !== '/') {
                router.push('/');
            }

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
            router.push('/setup');

            return;
        }

        setUpReturnUser(data[0]);

        if (pathname === '/') {
            if (
                data[0].badminton_level === 0 &&
                data[0].basketball_level === 0 &&
                data[0].soccer_level === 0 &&
                data[0].table_tennis_level === 0 &&
                data[0].tennis_level === 0
            ) {
                router.push('/setup');
            } else {
                router.push('/events');
            }
        }
    }

    useEffect(() => {
        setUp();
    }, []);

    return (
        <UserContext.Provider value={user}>
            <UserDispatchContext.Provider value={userDispatch}>
                <UserEventsContext.Provider value={userEvents}>
                    <SearchResultsContext.Provider value={searchResults}>
                        {children}
                    </SearchResultsContext.Provider>
                </UserEventsContext.Provider>
            </UserDispatchContext.Provider>
        </UserContext.Provider>
    );
}
