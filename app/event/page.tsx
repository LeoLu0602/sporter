'use client';

import EventCard from '@/components/EventCard';
import EventDetails from '@/components/EventDetails';
import { useEmail } from '@/context/Context';
import { EventType, supabase } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function Event() {
    const email = useEmail();
    const [events, setEvents] = useState<EventType[]>([]);
    const [eventDetails, setEventDetails] = useState<EventType | null>(null);

    useEffect(() => {
        async function setUp() {
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

            const { data: data2, error: error2 } = await supabase
                .from('participant')
                .select('*')
                .eq('user_id', data1[0].id);

            if (error2) {
                alert('Error!');
                console.error(error2);

                return;
            }

            if (data2.length === 0) {
                return;
            }

            const eventIds = data2.map(({ event_id }) => event_id);
            const { data: data3, error: error3 } = await supabase
                .from('event')
                .select('*')
                .in('id', eventIds);

            if (error3) {
                alert('Error!');
                console.error(error3);

                return;
            }

            if (data3.length === 0) {
                return;
            }

            setEvents(data3);
        }

        setUp();
    }, [email]);

    function seeMoreDetails(id: string) {
        setEventDetails(events.find((event) => event.id === id) ?? null);
    }

    function hideDetails() {
        setEventDetails(null);
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
                        hideDetails={() => {
                            hideDetails();
                        }}
                    />
                )}
                <section className="flex flex-col gap-4 mb-20">
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
