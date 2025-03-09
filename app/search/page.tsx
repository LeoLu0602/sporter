'use client';

import { datetime2str } from '@/lib/utils';
import { ChangeEvent, useEffect, useState } from 'react';

export default function Search() {
    const [startTime, setStartTime] = useState<Date | null>(null);

    useEffect(() => {
        setStartTimeNow();
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
            <main className="text-lg px-4">
                <section className="flex justify-center gap-4">
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
                <section></section>
            </main>
        </>
    );
}
