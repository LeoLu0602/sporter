'use client';

import EventCard from '@/components/EventCard';
import EventDetails from '@/components/EventDetails';
import { useUser, useUserEvents } from '@/context/Context';
import { calculateAge, EventType, getSportEmoji, supabase } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function Search() {
    const user = useUser();
    const userEvents = useUserEvents();
    const [events, setEvents] = useState<EventType[]>([]);
    const [eventDetails, setEventDetails] = useState<EventType | null>(null);

    useEffect(() => {
        searchEvents();
    }, [user]);

    async function searchEvents() {
        if (!user) {
            return;
        }

        setEvents([]);

        if (navigator.geolocation) {
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

                data.sort(
                    (a: { start_time: Date }, b: { start_time: Date }) =>
                        new Date(a.start_time).getTime() -
                        new Date(b.start_time).getTime()
                );

                // Hide events the user has already joined.
                setEvents(
                    data.filter(
                        ({ id }: { id: string }) =>
                            !new Set(userEvents.map(({ id }) => id)).has(id)
                    )
                );
            });
        } else {
            alert('Geolocation is not available');
        }
    }

    function seeMoreDetails(id: string) {
        setEventDetails(events.find((event) => event.id === id) ?? null);
    }

    function hideDetails() {
        setEventDetails(null);
    }

    async function joinEvent(userId: string, eventId: string) {
        const { data, error: error1 } = await supabase
            .from('participant')
            .select('*')
            .eq('user_id', userId)
            .eq('event_id', eventId);

        if (error1) {
            alert('Error!');
            console.error(error1);

            return;
        }

        if (data.length > 0) {
            return;
        }

        const { error: error2 } = await supabase
            .from('participant')
            .insert([{ user_id: userId, event_id: eventId }]);

        if (error2) {
            alert('Error!');
            console.error(error2);

            return;
        }

        const { error: error3 } = await supabase.rpc(
            'increment_remaining_spots',
            {
                event_id: eventId,
                x: -1,
            }
        );

        if (error3) {
            alert('Error!');
            console.error(error3);

            return;
        }

        window.location.replace('/event');
    }

    if (!user) {
        return <></>;
    }

    return (
        <>
            <header>
                <h1 className="text-center p-8 text-2xl font-bold">找運動</h1>
            </header>
            <main className="text-xl px-4 pb-20">
                {eventDetails && (
                    <EventDetails
                        details={eventDetails}
                        join={() => {
                            joinEvent(user.id, eventDetails.id);
                        }}
                        leave={null}
                        hideDetails={() => {
                            hideDetails();
                        }}
                    />
                )}
                <section className="flex flex-col gap-4">
                    {events.map(
                        ({
                            id,
                            sport,
                            title,
                            start_time,
                            end_time,
                            location,
                        }) => (
                            <EventCard
                                key={id}
                                isOwner={false}
                                sport={sport}
                                title={title}
                                startTime={new Date(start_time)}
                                endTime={new Date(end_time)}
                                location={location}
                                openCard={() => {
                                    seeMoreDetails(id);
                                }}
                            />
                        )
                    )}
                </section>
            </main>
        </>
    );
}
