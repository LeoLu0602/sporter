'use client';

import EventCard from '@/components/EventCard';
import EventDetails from '@/components/EventDetails';
import { useEmail } from '@/context/Context';
import { EventType, supabase } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function Event() {
    const email = useEmail();
    const [userId, setUserId] = useState<string | null>(null);
    const [events, setEvents] = useState<EventType[]>([]);
    const [eventDetails, setEventDetails] = useState<EventType | null>(null);

    useEffect(() => {
        async function setUp() {
            // Get user id with email.
            const { data: data1, error: error1 } = await supabase
                .from('user')
                .select('*')
                .eq('email', email);

            if (error1) {
                alert('Error!');
                console.error(error1);

                return;
            }

            if (data1.length === 0) {
                return;
            }

            setUserId(data1[0].id);

            // Get the events user joined.
            const { data: data2, error: error2 } = await supabase
                .from('participant')
                .select('*')
                .eq('user_id', data1[0].id);

            if (error2) {
                alert('Error!');
                console.error(error2);

                return;
            }

            // Get events user started.
            const { data: data3, error: error3 } = await supabase
                .from('event')
                .select('*')
                .eq('email', email);

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
            setEvents(data4);
        }

        setUp();
    }, [email]);

    function seeMoreDetails(id: string) {
        setEventDetails(events.find((event) => event.id === id) ?? null);
    }

    function hideDetails() {
        setEventDetails(null);
    }

    async function leave(userId: string, eventId: string) {
        // User is the one who starts the event.
        // === has the higher precedence than ??
        if ((eventDetails?.email ?? '') === email) {
            return;
        }

        const { error: error1 } = await supabase
            .from('participant')
            .delete()
            .eq('user_id', userId)
            .eq('event_id', eventId);

        if (error1) {
            alert('Error!');
            console.error(error1);

            return;
        }

        const { error: error2 } = await supabase.rpc(
            'increment_remaining_spots',
            {
                event_id: eventId,
                x: 1,
            }
        );

        if (error2) {
            alert('Error!');
            console.error(error2);

            return;
        }

        window.location.reload();
    }

    return (
        <>
            <header>
                <h1 className="text-center p-8 text-2xl font-bold">我的運動</h1>
            </header>
            <main className="p-4">
                {eventDetails && (
                    <EventDetails
                        details={eventDetails}
                        join={null}
                        leave={() => {
                            if (userId) {
                                leave(userId, eventDetails.id);
                            }
                        }}
                        hideDetails={() => {
                            hideDetails();
                        }}
                    />
                )}
                <section className="flex flex-col gap-4 mb-20">
                    {events.map(
                        ({
                            id,
                            email: eventEmail,
                            sport,
                            title,
                            start_time,
                            end_time,
                            location,
                        }) => (
                            <EventCard
                                key={id}
                                isOwner={eventEmail === email}
                                sport={sport!}
                                title={title}
                                startTime={new Date(start_time!)}
                                endTime={new Date(end_time!)}
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
