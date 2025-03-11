'use client';

import EventCard from '@/components/EventCard';
import EventDetails from '@/components/EventDetails';
import { useEmail } from '@/context/Context';
import {
    calculateAge,
    EventType,
    getSportEmoji,
    supabase,
    UserType,
} from '@/lib/utils';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

export default function Search() {
    const email = useEmail();
    const [chosenSport, setChosenSport] = useState<string | null>(null);
    const [events, setEvents] = useState<EventType[]>([]);
    const [userInfo, setUserInfo] = useState<UserType | null>(null);
    const [eventDetails, setEventDetails] = useState<EventType | null>(null);
    const [startTime, setStartTime] = useState<Dayjs>(dayjs());

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
                id,
                username,
                gender,
                birthday,
                distance,
                intro,
                badminton_level,
                basketball_level,
                soccer_level,
                table_tennis_level,
                tennis_level,
            } = data[0];

            const [y, m, d] = birthday
                .split('-')
                .map((str: string) => parseInt(str));

            setUserInfo({
                id,
                username,
                gender,
                birthday: new Date(y, m - 1, d), // Month is zero-based, which is fucking stupid.
                distance,
                intro,
                badminton_level,
                basketball_level,
                soccer_level,
                table_tennis_level,
                tennis_level,
            });
        }

        setUp();
    }, [email]);

    async function searchEvents(chosenSport: string, startTime: Date) {
        if (!userInfo) {
            return;
        }

        setEvents([]);

        const level: number =
            chosenSport === 'soccer'
                ? userInfo.soccer_level
                : chosenSport === 'basketball'
                  ? userInfo.basketball_level
                  : chosenSport === 'tennis'
                    ? userInfo.tennis_level
                    : chosenSport === 'table tennis'
                      ? userInfo.table_tennis_level
                      : userInfo.badminton_level;

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
                    (a: { start_time: Date }, b: { start_time: Date }) =>
                        new Date(a.start_time).getTime() -
                        new Date(b.start_time).getTime()
                );
                setEvents(data);
            });
        } else {
            alert('Geolocation is not available');
        }
    }

    function clickOnSport(sport: string) {
        setChosenSport(sport);
        searchEvents(sport, startTime.toDate());
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
                            if (userInfo) {
                                joinEvent(userInfo.id, eventDetails.id);
                            }
                        }}
                        leave={null}
                        hideDetails={() => {
                            hideDetails();
                        }}
                    />
                )}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['MobileDateTimePicker']}>
                        <DemoItem label="">
                            <MobileDateTimePicker
                                value={startTime}
                                onChange={(newDateVal) => {
                                    if (newDateVal) {
                                        setStartTime(newDateVal);

                                        if (chosenSport) {
                                            searchEvents(
                                                chosenSport,
                                                newDateVal.toDate()
                                            );
                                        }
                                    }
                                }}
                            />
                        </DemoItem>
                    </DemoContainer>
                </LocalizationProvider>
                <section>
                    <ul className="flex justify-around flex-wrap my-8">
                        {[
                            'soccer',
                            'basketball',
                            'tennis',
                            'table tennis',
                            'badminton',
                        ].map((sport) => (
                            <li key={sport}>
                                <button
                                    className={clsx('w-full py-4 px-4 rounded-xl', {
                                        'bg-emerald-400': chosenSport === sport,
                                        'bg-[#ddd]': chosenSport !== sport,
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
                            start_time,
                            end_time,
                            location,
                        }) => (
                            // Each column in event table is not nullable.
                            // That's why ! is used here.
                            <EventCard
                                key={id}
                                sport={sport!}
                                title={title}
                                startTime={start_time!}
                                endTime={end_time!}
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
