'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { supabase } from '@/lib/utils';
import { useEmail } from '@/context/Context';
import LevelBarMulti from '@/components/LevelBarMulti';

export default function New() {
    const email = useEmail();
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
        participantNum: number;
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
        participantNum: 1,
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
        const age: number = calculateAge(userInfo.birthday);

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
            participantNum: 1,
            date: '',
            time: '',
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
            .split(', ')
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

    function incrementParticipantNum(amount: number) {
        const newParticipantNum: number = eventInfo.participantNum + amount;

        if (newParticipantNum >= 1 && newParticipantNum <= 99) {
            setEventInfo((oldVal) => {
                return { ...oldVal, participantNum: newParticipantNum };
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

    async function createNewEvent() {}

    return (
        <main className="p-4 min-h-screen">
            <h1 className="text-center pb-4 border-b-black border-b-2 text-2xl font-bold">
                揪運動
            </h1>
            {sport === null && (
                <section className="flex flex-wrap justify-between gap-4 mt-4">
                    <button
                        className="w-40 h-40 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl"
                        onClick={() => {
                            selectSport('soccer');
                        }}
                    >
                        ⚽
                    </button>
                    <button
                        className="w-40 h-40 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl"
                        onClick={() => {
                            selectSport('basketball');
                        }}
                    >
                        🏀
                    </button>
                    <button
                        className="w-40 h-40 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl"
                        onClick={() => {
                            selectSport('tennis');
                        }}
                    >
                        🎾
                    </button>
                    <button
                        className="w-40 h-40 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl"
                        onClick={() => {
                            selectSport('table tennis');
                        }}
                    >
                        🏓
                    </button>
                    <button
                        className="w-40 h-40 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl"
                        onClick={() => {
                            selectSport('badminton');
                        }}
                    >
                        🏸
                    </button>
                </section>
            )}
            {sport !== null && (
                <>
                    <section>
                        <section className="flex h-16 justify-between items-center">
                            <div className="flex gap-2">
                                {sport === 'soccer' && (
                                    <>
                                        <h2 className="text-2xl">⚽</h2>
                                        <input
                                            className="text-2xl w-60 focus:outline-none"
                                            name="title"
                                            value={eventInfo.title}
                                            onChange={handleEventInfoChange}
                                        />
                                    </>
                                )}
                                {sport === 'basketball' && (
                                    <>
                                        <h2 className="text-2xl">🏀</h2>
                                        <input
                                            className="text-2xl w-60 focus:outline-none"
                                            name="title"
                                            value={eventInfo.title}
                                            onChange={handleEventInfoChange}
                                        />
                                    </>
                                )}
                                {sport === 'tennis' && (
                                    <>
                                        <h2 className="text-2xl">🎾</h2>
                                        <input
                                            className="text-2xl w-60 focus:outline-none"
                                            name="title"
                                            value={eventInfo.title}
                                            onChange={handleEventInfoChange}
                                        />
                                    </>
                                )}
                                {sport === 'table tennis' && (
                                    <>
                                        <h2 className="text-2xl">🏓</h2>
                                        <input
                                            className="text-2xl w-60 focus:outline-none"
                                            name="title"
                                            value={eventInfo.title}
                                            onChange={handleEventInfoChange}
                                        />
                                    </>
                                )}
                                {sport === 'badminton' && (
                                    <>
                                        <h2 className="text-2xl">🏸</h2>
                                        <input
                                            className="text-2xl w-60 focus:outline-none"
                                            name="title"
                                            value={eventInfo.title}
                                            onChange={handleEventInfoChange}
                                        />
                                    </>
                                )}
                            </div>
                        </section>
                    </section>
                    <section className="flex flex-col items-center gap-4">
                        <section className="w-full">
                            <h2 className="font-bold">選擇對手程度</h2>
                            {sport === 'soccer' && (
                                <LevelBarMulti
                                    levels={eventInfo.levels}
                                    chooseLevel={chooseLevel}
                                />
                            )}
                            {sport === 'basketball' && (
                                <LevelBarMulti
                                    levels={eventInfo.levels}
                                    chooseLevel={chooseLevel}
                                />
                            )}
                            {sport === 'tennis' && (
                                <LevelBarMulti
                                    levels={eventInfo.levels}
                                    chooseLevel={chooseLevel}
                                />
                            )}
                            {sport === 'table tennis' && (
                                <LevelBarMulti
                                    levels={eventInfo.levels}
                                    chooseLevel={chooseLevel}
                                />
                            )}
                            {sport === 'badminton' && (
                                <LevelBarMulti
                                    levels={eventInfo.levels}
                                    chooseLevel={chooseLevel}
                                />
                            )}
                        </section>
                        <section className="w-full flex gap-4">
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
                        <section className="w-full flex flex-col gap-2">
                            <label>
                                <b>選擇最小對手年紀: </b>
                                {eventInfo.ageMin}
                            </label>
                            <input
                                className="w-full"
                                type="range"
                                name="ageMin"
                                min={0}
                                max={100}
                                value={eventInfo.ageMin}
                                onChange={handleEventInfoChange}
                            />
                        </section>
                        <section className="w-full flex flex-col gap-2">
                            <label>
                                <b>選擇最大對手年紀: </b>
                                {eventInfo.ageMax}
                            </label>
                            <input
                                className="w-full"
                                type="range"
                                name="ageMax"
                                min={0}
                                max={100}
                                value={eventInfo.ageMax}
                                onChange={handleEventInfoChange}
                            />
                        </section>
                        <section className="w-full">
                            <section className="flex flex-col gap-2 mb-2">
                                <label className="font-bold">
                                    輸入座標 (經度，緯度) or{' '}
                                    <span className="text-sky-500 cursor-pointer">
                                        選擇熱門場地
                                    </span>
                                </label>
                                <input
                                    className="border-2 border-black focus:outline-none p-2"
                                    type="text"
                                    value={coordinate}
                                    onChange={handleCoordinateUpdate}
                                />
                            </section>
                            <section className="flex flex-col gap-2">
                                <label className="font-bold">地點名稱:</label>
                                <input
                                    className="border-2 border-black focus:outline-none p-2"
                                    type="text"
                                    name="location"
                                    value={eventInfo.location}
                                    onChange={handleEventInfoChange}
                                />
                            </section>
                        </section>
                        <section className="w-full flex items-center">
                            <div className="mr-2">
                                <b>需求人數:</b>
                            </div>
                            <button
                                className="bg-rose-500 w-6 h-6 text-white font-bold flex justify-center items-center rounded-full"
                                onClick={() => {
                                    incrementParticipantNum(-1);
                                }}
                            >
                                &#8722;
                            </button>
                            <div className="w-10 text-center">
                                {eventInfo.participantNum}
                            </div>
                            <button
                                className="bg-emerald-500 w-6 h-6 text-white font-bold flex justify-center items-center rounded-full"
                                onClick={() => {
                                    incrementParticipantNum(1);
                                }}
                            >
                                +
                            </button>
                        </section>
                        <section className="w-full">
                            <label className="font-bold mr-2">
                                選擇開始時間:
                            </label>
                            <input
                                type="datetime-local"
                                name="time"
                                value={
                                    eventInfo.time
                                        ? eventInfo.time
                                              .getFullYear()
                                              .toString() +
                                          '-' +
                                          (eventInfo.time.getMonth() + 1)
                                              .toString()
                                              .padStart(2, '0') +
                                          '-' +
                                          eventInfo.time.getDate() +
                                          'T' +
                                          eventInfo.time
                                              .getHours()
                                              .toString()
                                              .padStart(2, '0') +
                                          ':' +
                                          eventInfo.time
                                              .getMinutes()
                                              .toString()
                                              .padStart(2, '0')
                                        : ''
                                }
                                onChange={handleEventInfoChange}
                            />
                        </section>
                        <section className="w-full">
                            <section className="w-full flex items-center">
                                <div className="mr-2">
                                    <b>選擇時長:</b>
                                </div>
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
                        </section>
                        <section className="flex flex-col gap-8 mt-8">
                            <button
                                className="px-8 py-2 bg-emerald-500 font-bold text-white"
                                onClick={() => {
                                    setSport(null);
                                }}
                            >
                                取消
                            </button>
                            <button
                                className="px-8 py-2 bg-sky-500 font-bold text-white mb-20"
                                onClick={() => {
                                    createNewEvent();
                                }}
                            >
                                確認送出
                            </button>
                        </section>
                    </section>
                </>
            )}
        </main>
    );
}
