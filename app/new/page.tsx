'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { supabase, getSportEmoji, datetime2str } from '@/lib/utils';
import { useEmail } from '@/context/Context';
import LevelBarMulti from '@/components/LevelBarMulti';
import { useRouter } from 'next/navigation';

export default function New() {
    const email = useEmail();
    const router = useRouter();
    const [sport, setSport] = useState<string | null>(null);
    const [coordinate, setCoordinate] = useState<string>('');
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
    const [eventInfo, setEventInfo] = useState<{
        sport: string | null;
        title: string;
        gender: number; // 1: male, 2: female, 3: any
        ageMin: number;
        ageMax: number;
        levels: Set<number>;
        lat: number;
        lng: number;
        location: string;
        participantLimit: number;
        time: Date | null;
        length: number;
    }>({
        sport: null,
        title: '未命名',
        gender: 3,
        ageMin: 5,
        ageMax: 95,
        levels: new Set([1]),
        lat: 0,
        lng: 0,
        location: '',
        participantLimit: 1,
        time: null,
        length: 2,
    });

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

    function calculateAge(birthday: Date): number {
        const [by, bm, bd] = [
            birthday.getFullYear(),
            birthday.getMonth() + 1, // Month is zero-based, which is fucking stupid.
            birthday.getDate(),
        ];

        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth() + 1; // Gets the month (0-based, so add 1).
        const d = now.getDate();

        if (m < bm || (m === bm && d < bd)) {
            return y - by - 1;
        }

        return y - by;
    }

    function selectSport(sport: string) {
        const age: number = userInfo.birthday
            ? calculateAge(userInfo.birthday)
            : 20;

        setSport(sport);
        setEventInfo({
            sport,
            title: '未命名',
            gender: userInfo.gender,
            ageMin: Math.max(0, age - 5),
            ageMax: Math.min(100, age + 5),
            levels:
                sport === 'soccer'
                    ? new Set([userInfo.soccerLevel])
                    : sport === 'basketball'
                      ? new Set([userInfo.basketballLevel])
                      : sport === 'tennis'
                        ? new Set([userInfo.tennisLevel])
                        : sport === 'table tennis'
                          ? new Set([userInfo.tableTennisLevel])
                          : new Set([userInfo.badmintonLevel]),
            lat: 0,
            lng: 0,
            location: '',
            participantLimit: 1,
            time: null,
            length: 2,
        });
    }

    function chooseLevel(i: number) {
        setEventInfo((oldVal) => {
            const newLevels: Set<number> = new Set(oldVal.levels);

            if (newLevels.has(i)) {
                newLevels.delete(i);
            } else {
                newLevels.add(i);
            }

            return {
                ...oldVal,
                levels: newLevels,
            };
        });
    }

    function handleCoordinateUpdate(e: ChangeEvent<HTMLInputElement>) {
        const coord: string = e.target.value;

        setCoordinate(coord);

        const [lat, lng] = coord
            .replace(/[()]/g, '')
            .split(',')
            .map(parseFloat);

        if (Number.isNaN(lat) || Number.isNaN(lng)) {
            return;
        }

        setEventInfo((oldVal) => {
            return {
                ...oldVal,
                lat,
                lng,
            };
        });
    }

    function incrementParticipantLimit(amount: number) {
        const newParticipantLimit: number = eventInfo.participantLimit + amount;

        if (newParticipantLimit >= 1 && newParticipantLimit <= 99) {
            setEventInfo((oldVal) => {
                return { ...oldVal, participantLimit: newParticipantLimit };
            });
        }
    }

    function incrementLength(amount: number) {
        const newLength: number = eventInfo.length + amount;

        if (newLength >= 0.5 && newLength <= 24) {
            setEventInfo((oldVal) => {
                return { ...oldVal, length: newLength };
            });
        }
    }

    function handleEventInfoChange(e: ChangeEvent<HTMLInputElement>) {
        switch (e.target.name) {
            case 'title':
                setEventInfo((oldVal) => {
                    return { ...oldVal, title: e.target.value };
                });
                break;
            case 'gender':
                setEventInfo((oldVal) => {
                    return { ...oldVal, gender: parseInt(e.target.value) };
                });
                break;
            case 'ageMin':
                if (parseInt(e.target.value) > eventInfo.ageMax) {
                    return;
                }

                setEventInfo((oldVal) => {
                    return { ...oldVal, ageMin: parseInt(e.target.value) };
                });
                break;
            case 'ageMax':
                if (eventInfo.ageMin > parseInt(e.target.value)) {
                    return;
                }

                setEventInfo((oldVal) => {
                    return { ...oldVal, ageMax: parseInt(e.target.value) };
                });
                break;
            case 'location':
                setEventInfo((oldVal) => {
                    return { ...oldVal, location: e.target.value };
                });
                return;
            case 'time':
                setEventInfo((oldVal) => {
                    return { ...oldVal, time: new Date(e.target.value) };
                });
                break;
        }
    }

    async function createNewEvent() {
        const {
            sport,
            title,
            gender,
            ageMin: age_min,
            ageMax: age_max,
            levels,
            lat,
            lng,
            location,
            participantLimit: participant_limit,
            time,
            length,
        } = eventInfo;

        const { error } = await supabase.from('event').insert([
            {
                email,
                sport,
                title,
                gender,
                age_min,
                age_max,
                levels: Array.from(levels),
                lat,
                lng,
                location,
                participant_limit,
                time,
                length,
            },
        ]);

        if (error) {
            alert('Error!');
            console.error(error);

            return;
        }

        router.push('/search');
    }

    function setStartTimeNow() {
        setEventInfo((oldVal) => {
            return { ...oldVal, time: new Date() };
        });
    }

    return (
        <>
            <header>
                <h1 className="text-center p-8 text-2xl font-bold">揪運動</h1>
            </header>
            <main className="px-4">
                {sport === null && (
                    <section className="flex flex-wrap justify-between gap-8">
                        {[
                            'soccer',
                            'basketball',
                            'tennis',
                            'table tennis',
                            'badminton',
                        ].map((sport) => (
                            <button
                                className="w-40 h-40 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl"
                                key={sport}
                                onClick={() => {
                                    selectSport(sport);
                                }}
                            >
                                {getSportEmoji(sport)}
                            </button>
                        ))}
                    </section>
                )}
                {sport !== null && (
                    <section className="flex flex-col gap-8 text-lg">
                        <section>
                            <h2 className="text-2xl inline mr-4">
                                {getSportEmoji(sport)}
                            </h2>
                            <input
                                className="text-2xl w-60 focus:outline-none"
                                name="title"
                                value={eventInfo.title}
                                onChange={handleEventInfoChange}
                            />
                        </section>
                        <section className="w-full">
                            <h2 className="font-bold">選擇對手程度</h2>
                            <LevelBarMulti
                                levels={eventInfo.levels}
                                chooseLevel={chooseLevel}
                            />
                        </section>
                        <section className="flex gap-4">
                            <h2 className="font-bold">選擇對手性別:</h2>
                            <section>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="1"
                                    checked={eventInfo.gender === 1}
                                    onChange={handleEventInfoChange}
                                />
                                <label className="ml-2">男</label>
                            </section>
                            <section>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="2"
                                    checked={eventInfo.gender === 2}
                                    onChange={handleEventInfoChange}
                                />
                                <label className="ml-2">女</label>
                            </section>
                            <section>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="3"
                                    checked={eventInfo.gender === 3}
                                    onChange={handleEventInfoChange}
                                />
                                <label className="ml-2">不限</label>
                            </section>
                        </section>
                        <section>
                            <label className="block">
                                <b>選擇最小對手年紀: </b>
                                {eventInfo.ageMin}
                            </label>
                            <input
                                className="w-full mt-8"
                                type="range"
                                name="ageMin"
                                min={0}
                                max={100}
                                value={eventInfo.ageMin}
                                onChange={handleEventInfoChange}
                            />
                        </section>
                        <section>
                            <label className="block">
                                <b>選擇最大對手年紀: </b>
                                {eventInfo.ageMax}
                            </label>
                            <input
                                className="w-full mt-8"
                                type="range"
                                name="ageMax"
                                min={0}
                                max={100}
                                value={eventInfo.ageMax}
                                onChange={handleEventInfoChange}
                            />
                        </section>
                        <section>
                            <label className="font-bold block">
                                輸入座標 (經度，緯度) or{' '}
                                <span className="text-sky-500 cursor-pointer">
                                    選擇熱門場地
                                </span>
                            </label>
                            <input
                                className="border-2 border-black focus:outline-none p-2 mt-4 w-full"
                                type="text"
                                value={coordinate}
                                onChange={handleCoordinateUpdate}
                            />
                        </section>
                        <section>
                            <label className="font-bold block">地點名稱:</label>
                            <input
                                className="border-2 border-black focus:outline-none p-2 w-full mt-4"
                                type="text"
                                name="location"
                                value={eventInfo.location}
                                onChange={handleEventInfoChange}
                            />
                        </section>
                        <section className="flex items-center gap-4">
                            <h2 className="font-bold mr-4">需求人數:</h2>
                            <button
                                className="bg-rose-500 w-6 h-6 text-white font-bold flex justify-center items-center rounded-full"
                                onClick={() => {
                                    incrementParticipantLimit(-1);
                                }}
                            >
                                &#8722;
                            </button>
                            <div className="w-20 text-center">
                                {eventInfo.participantLimit}
                            </div>
                            <button
                                className="bg-emerald-500 w-6 h-6 text-white font-bold flex justify-center items-center rounded-full"
                                onClick={() => {
                                    incrementParticipantLimit(1);
                                }}
                            >
                                +
                            </button>
                        </section>
                        <section>
                            <label className="font-bold mr-4 mb-4 block">
                                選擇開始時間:
                            </label>
                            <input
                                className="mr-4"
                                type="datetime-local"
                                name="time"
                                value={datetime2str(eventInfo.time)}
                                onChange={handleEventInfoChange}
                            />
                            <button
                                className="font-bold text-emerald-500"
                                onClick={setStartTimeNow}
                            >
                                馬上揪！
                            </button>
                        </section>
                        <section className="w-full flex items-center gap-4">
                            <h2 className="font-bold">選擇時長:</h2>
                            <button
                                className="bg-rose-500 w-6 h-6 text-white font-bold flex justify-center items-center rounded-full"
                                onClick={() => {
                                    incrementLength(-0.5);
                                }}
                            >
                                &#8722;
                            </button>
                            <div className="w-20 text-center">
                                {eventInfo.length} hr
                            </div>
                            <button
                                className="bg-emerald-500 w-6 h-6 text-white font-bold flex justify-center items-center rounded-full"
                                onClick={() => {
                                    incrementLength(0.5);
                                }}
                            >
                                +
                            </button>
                        </section>
                        <button
                            className="px-8 py-2 bg-emerald-600 font-bold text-white"
                            onClick={() => {
                                setSport(null);
                            }}
                        >
                            取消
                        </button>
                        <button
                            className="px-8 py-2 bg-sky-600 font-bold text-white mb-24"
                            disabled={!sport || !eventInfo.time || !email}
                            onClick={() => {
                                createNewEvent();
                            }}
                        >
                            確認送出
                        </button>
                    </section>
                )}
            </main>
        </>
    );
}
