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
    const [option, setOption] = useState<number>(1);

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

    const userEvents1 = userEvents.filter(
        ({ remaining_spots, start_time }) =>
            new Date(start_time).getTime() > Date.now() && remaining_spots > 0
    );
    const userEvents2 = userEvents.filter(
        ({ remaining_spots, start_time }) =>
            new Date(start_time).getTime() > Date.now() && remaining_spots === 0
    );
    const userEvents3 = userEvents.filter(
        ({ start_time }) => new Date(start_time).getTime() <= Date.now()
    );
    const shownUserEvents =
        option === 1 ? userEvents1 : option === 2 ? userEvents2 : userEvents3;

    return (
        <>
            <nav className="py-4 text-xl sticky left-0 top-0 bg-white border-b-[1px] border-gray-200">
                <ul className="flex w-full justify-around">
                    <li
                        className={clsx('cursor-pointer', {
                            'border-b-2 border-b-black text-black':
                                option === 1,
                            'text-gray-500': option !== 1,
                        })}
                        onClick={() => {
                            setOption(1);
                        }}
                    >
                        未滿
                    </li>
                    <li
                        className={clsx('cursor-pointer', {
                            'border-b-2 border-b-black text-black':
                                option === 2,
                            'text-gray-500': option !== 2,
                        })}
                        onClick={() => {
                            setOption(2);
                        }}
                    >
                        已滿
                    </li>
                    <li
                        className={clsx('cursor-pointer', {
                            'border-b-2 border-b-black text-black':
                                option === 3,
                            'text-gray-500': option !== 3,
                        })}
                        onClick={() => {
                            setOption(3);
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
                    {shownUserEvents.length > 0 ? (
                        shownUserEvents.map(
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
                        )
                    ) : (
                        <div className="text-center py-8 text-xl text-gray-500">
                            空空如也~
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
