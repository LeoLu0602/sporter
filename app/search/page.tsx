'use client';

import EventCard from '@/components/EventCard';
import { datetime2str, supabase } from '@/lib/utils';
import { ChangeEvent, useEffect, useState } from 'react';

export default function Search() {
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        async function setUp() {
            setStartTimeNow();

            const { data, error } = await supabase.from('event').select('*');

            if (error) {
                alert('Error!');
                console.error(error);

                return;
            }

            setEvents(data);
        }

        setUp();
    }, []);

    function handleStartTimeChange(e: ChangeEvent<HTMLInputElement>) {
        setStartTime(new Date(e.target.value));
    }

    function setStartTimeNow() {
        setStartTime(new Date());
    }

    return (
        <>
            <header>
                <h1 className="text-center p-8 text-2xl font-bold">找運動</h1>
            </header>
            <main className="text-xl px-4">
                <section className="flex justify-center gap-4 mb-8">
                    <input
                        type="datetime-local"
                        value={datetime2str(startTime)}
                        onChange={handleStartTimeChange}
                    />
                    <button
                        className="text-emerald-600 font-bold"
                        onClick={setStartTimeNow}
                    >
                        馬上動！
                    </button>
                </section>
                <section className="flex flex-col gap-4">
                    {events.map(({ id, sport, title, time, location }) => (
                        <EventCard
                            key={id}
                            sport={sport}
                            title={title}
                            time={time}
                            location={location}
                        />
                    ))}
                </section>
            </main>
        </>
    );
}
