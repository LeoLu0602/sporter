'use client';

import EventCard from '@/components/EventCard';
import EventDetails from '@/components/EventDetails';
import { useUser, useUserEvents } from '@/context/Context';
import { EventType, supabase } from '@/lib/utils';
import { useState } from 'react';

export default function Event() {
    const user = useUser();
    const userEvents = useUserEvents();
    const [eventDetails, setEventDetails] = useState<EventType | null>(null);

    function seeMoreDetails(id: string) {
        setEventDetails(userEvents.find((event) => event.id === id) ?? null);
    }

    function hideDetails() {
        setEventDetails(null);
    }

    async function leave(userId: string, eventId: string) {
        // User started the event and hence can't leave.
        if (eventDetails && user && eventDetails.email === user.email) {
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

    if (!user) {
        return <></>;
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
                            if (user) {
                                leave(user.id, eventDetails.id);
                            }
                        }}
                        hideDetails={() => {
                            hideDetails();
                        }}
                    />
                )}
                <section className="flex flex-col gap-4 mb-20">
                    {userEvents.map(
                        ({
                            id,
                            email,
                            sport,
                            title,
                            start_time,
                            end_time,
                            location,
                        }) => (
                            <EventCard
                                key={id}
                                isOwner={user.email === email}
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
