'use client';

import EventCard from '@/components/EventCard';
import EventDetails from '@/components/EventDetails';
import { useUser, useUserEvents } from '@/context/Context';
import { EventType } from '@/lib/utils';
import clsx from 'clsx';
import { useState } from 'react';

export default function Event() {
    const user = useUser();
    const userEvents = useUserEvents();
    const [eventDetails, setEventDetails] = useState<EventType | null>(null);
    const [option, setOption] = useState<string>('future');

    if (!user || !userEvents) {
        return <></>;
    }

    function seeMoreDetails(id: string) {
        if (userEvents) {
            setEventDetails(
                userEvents.find((event) => event.id === id) ?? null
            );
        }
    }

    function hideDetails() {
        setEventDetails(null);
    }

    const matchingUserEvents = userEvents.filter(
        ({ remaining_spots, start_time }) =>
            new Date(start_time).getTime() > Date.now() && remaining_spots > 0
    );
    const futureUserEvents = userEvents.filter(
        ({ remaining_spots, start_time }) =>
            new Date(start_time).getTime() > Date.now() && remaining_spots === 0
    );
    const pastUserEvents = userEvents.filter(
        ({ start_time }) => new Date(start_time).getTime() <= Date.now()
    );
    const shownUserEvents =
        option === 'future'
            ? futureUserEvents
            : option === 'past'
              ? pastUserEvents
              : matchingUserEvents;

    return (
        <>
            <nav className="py-4 text-xl sticky left-0 top-0 bg-white">
                <ul className="flex w-full justify-around">
                    <li
                        className={clsx('cursor-pointer', {
                            'border-b-2 border-b-black text-black':
                                option === 'matching',
                            'text-gray-500': option !== 'matching',
                        })}
                        onClick={() => {
                            setOption('matching');
                        }}
                    >
                        未滿
                    </li>
                    <li
                        className={clsx('cursor-pointer', {
                            'border-b-2 border-b-black text-black':
                                option === 'future',
                            'text-gray-500': option !== 'future',
                        })}
                        onClick={() => {
                            setOption('future');
                        }}
                    >
                        已滿
                    </li>
                    <li
                        className={clsx('cursor-pointer', {
                            'border-b-2 border-b-black text-black':
                                option === 'past',
                            'text-gray-500': option !== 'past',
                        })}
                        onClick={() => {
                            setOption('past');
                        }}
                    >
                        歷史
                    </li>
                </ul>
            </nav>
            <main>
                {eventDetails && (
                    <EventDetails
                        userEmail={user.email}
                        details={eventDetails}
                        hideDetails={() => {
                            hideDetails();
                        }}
                    />
                )}
                <section className="pb-12">
                    {shownUserEvents.map(
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
