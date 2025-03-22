'use client';

import EventCard from '@/components/EventCard';
import EventDetails from '@/components/EventDetails';
import { useSearchResults, useUser } from '@/context/Context';
import { EventType } from '@/lib/utils';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export default function Search() {
    const user = useUser();
    const searchResults = useSearchResults();
    const [eventDetails, setEventDetails] = useState<EventType | null>(null);

    function seeMoreDetails(id: string) {
        if (searchResults) {
            setEventDetails(
                searchResults.find((event) => event.id === id) ?? null
            );
        }
    }

    function hideDetails() {
        setEventDetails(null);
    }

    return (
        <>
            <header>
                <h1 className="text-center py-4 text-2xl border-b-[1px] border-gray-200">
                    找運動
                </h1>
            </header>
            <main className="text-xl pb-12">
                {user && eventDetails && (
                    <EventDetails
                        userEmail={user.email}
                        details={eventDetails}
                        hideDetails={() => {
                            hideDetails();
                        }}
                    />
                )}
                {!searchResults && (
                    <section className="flex justify-center items-center w-full h-screen absolute left-0 top-0">
                        <CircularProgress />
                    </section>
                )}
                {searchResults && (
                    <section className="flex flex-col gap-4">
                        {searchResults.map(
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
                )}
            </main>
        </>
    );
}
