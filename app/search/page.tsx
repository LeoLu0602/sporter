'use client';

import EventCard from '@/components/EventCard';
import { useEmail } from '@/context/Context';
import {
    calculateAge,
    datetime2str,
    getSportEmoji,
    supabase,
} from '@/lib/utils';
import clsx from 'clsx';
import { ChangeEvent, useEffect, useState } from 'react';

export default function Search() {
    const email = useEmail();
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [chosenSport, setChosenSport] = useState<string>('soccer');
    const [events, setEvents] = useState<any[]>([]);
    const [userInfo, setUserInfo] = useState<{
        username: string;
        gender: number; // 1: male, 2: female, 3: any
        birthday: Date | null;
        distance: number;
        intro: string;
        badmintonLevel: number;
        basketballLevel: number;
        soccerLevel: number;
        tableTennisLevel: number;
        tennisLevel: number;
    }>({
        username: '',
        gender: 3,
        birthday: null,
        distance: 1000,
        intro: '',
        badmintonLevel: 0,
        basketballLevel: 0,
        soccerLevel: 0,
        tableTennisLevel: 0,
        tennisLevel: 0,
    });
    const level: number =
        chosenSport === 'soccer'
            ? userInfo.soccerLevel
            : chosenSport === 'basketball'
              ? userInfo.basketballLevel
              : chosenSport === 'tennis'
                ? userInfo.tennisLevel
                : chosenSport === 'table tennis'
                  ? userInfo.tableTennisLevel
                  : userInfo.badmintonLevel;

    useEffect(() => {
        async function setUp() {
            const { data, error } = await supabase
                .from('user')
                .select('*')
                .eq('email', email);

            if (error) {
                alert('Error!');
                console.error(error);

                return;
            }

            if (data.length === 0) {
                return;
            }

            const {
                username,
                gender,
                birthday,
                distance,
                intro,
                badminton_level: badmintonLevel,
                basketball_level: basketballLevel,
                soccer_level: soccerLevel,
                table_tennis_level: tableTennisLevel,
                tennis_level: tennisLevel,
            } = data[0];

            const [y, m, d] = birthday
                .split('-')
                .map((str: string) => parseInt(str));

            setUserInfo({
                username,
                gender,
                birthday: new Date(y, m - 1, d), // Month is zero-based, which is fucking stupid.
                distance,
                intro,
                badmintonLevel,
                basketballLevel,
                soccerLevel,
                tableTennisLevel,
                tennisLevel,
            });
        }

        setUp();
    }, [email]);

    useEffect(() => {
        setEvents([]);
        searchEvents();
    }, [chosenSport, startTime]);

    async function searchEvents() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { data, error } = await supabase.rpc('filter_events', {
                    user_lat: position.coords.latitude,
                    user_lng: position.coords.longitude,
                    d: userInfo.distance,
                    chosen_sport: chosenSport,
                    user_gender: userInfo.gender,
                    user_age: userInfo.birthday
                        ? calculateAge(userInfo.birthday)
                        : 20,
                    user_level: level,
                    user_time: startTime,
                });

                if (error) {
                    alert('Error!');
                    console.error(error);

                    return;
                }

                data.sort(
                    (a: { time: string }, b: { time: string }) =>
                        new Date(a.time).getTime() - new Date(b.time).getTime()
                );
                setEvents(data);
            });
        } else {
            alert('Geolocation is not available');
        }
    }

    function handleStartTimeChange(e: ChangeEvent<HTMLInputElement>) {
        setStartTime(new Date(e.target.value));
    }

    function setStartTimeNow() {
        setStartTime(new Date());
    }

    function clickOnSport(sport: string) {
        setChosenSport(sport);
    }

    function openCard(id: string) {}

    return (
        <>
            <header>
                <h1 className="text-center p-8 text-2xl font-bold">找運動</h1>
            </header>
            <main className="text-xl px-4 pb-20">
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
                <section>
                    <ul className="flex justify-around my-8">
                        {[
                            'soccer',
                            'basketball',
                            'tennis',
                            'table tennis',
                            'badminton',
                        ].map((sport) => (
                            <li className="w-1/5" key={sport}>
                                <button
                                    className={clsx('w-full py-2', {
                                        'border-emerald-600 border-2 box-border':
                                            chosenSport === sport,
                                    })}
                                    onClick={() => {
                                        clickOnSport(sport);
                                    }}
                                >
                                    {getSportEmoji(sport)}
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
                <section className="flex flex-col gap-4">
                    {events.map(
                        ({
                            id,
                            sport,
                            title,
                            start_time: startTime,
                            end_time: endTime,
                            location,
                        }) => (
                            <EventCard
                                key={id}
                                sport={sport}
                                title={title}
                                startTime={startTime}
                                endTime={endTime}
                                location={location}
                                openCard={() => {
                                    openCard(id);
                                }}
                            />
                        )
                    )}
                </section>
            </main>
        </>
    );
}
