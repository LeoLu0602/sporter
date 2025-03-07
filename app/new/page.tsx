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
        name: string;
        gender: 'male' | 'female' | 'prefer not to say';
        birthday: string;
        distance: number;
        intro: string;
        badmintonLevel: number;
        basketballLevel: number;
        soccerLevel: number;
        tableTennisLevel: number;
        tennisLevel: number;
    }>({
        name: '',
        gender: 'prefer not to say',
        birthday: '',
        distance: 500,
        intro: '',
        badmintonLevel: 0,
        basketballLevel: 0,
        soccerLevel: 0,
        tableTennisLevel: 0,
        tennisLevel: 0,
    });
    const [eventInfo, setEventInfo] = useState<{
        title: string;
        gender: number; // 1: male, 2: female, 3: any
        ageMin: number;
        ageMax: number;
        badmintonLevels: Set<number>;
        basketballLevels: Set<number>;
        soccerLevels: Set<number>;
        tableTennisLevels: Set<number>;
        tennisLevels: Set<number>;
        lat: number;
        lng: number;
        location: string;
        participantNum: number;
    }>({
        title: '未命名',
        gender: 3,
        ageMin: 5,
        ageMax: 95,
        badmintonLevels: new Set([0]),
        basketballLevels: new Set([0]),
        soccerLevels: new Set([0]),
        tableTennisLevels: new Set([0]),
        tennisLevels: new Set([0]),
        lat: 0,
        lng: 0,
        location: '',
        participantNum: 1,
    });

    useEffect(() => {
        async function setUp() {
            const { data, error } = await supabase
                .from('profile')
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

            setUserInfo({
                name: data[0].username,
                gender:
                    data[0].gender === 1
                        ? 'male'
                        : data[0].gender === 2
                          ? 'female'
                          : 'prefer not to say',
                birthday: data[0].birthday,
                distance: data[0].distance,
                intro: data[0].intro,
                badmintonLevel: data[0].badminton_level,
                basketballLevel: data[0].basketball_level,
                soccerLevel: data[0].soccer_level,
                tableTennisLevel: data[0].table_tennis_level,
                tennisLevel: data[0].tennis_level,
            });

            setEventInfo((oldVal) => {
                return {
                    ...oldVal,
                    badmintonLevels: new Set([data[0].badminton_level]),
                    basketballLevels: new Set([data[0].basketball_level]),
                    soccerLevels: new Set([data[0].soccer_level]),
                    tableTennisLevels: new Set([data[0].table_tennis_level]),
                    tennisLevels: new Set([data[0].tennis_level]),
                };
            });
        }

        setUp();
    }, [email]);

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
                if (parseInt(e.target.value) >= eventInfo.ageMax) {
                    return;
                }

                setEventInfo((oldVal) => {
                    return { ...oldVal, ageMin: parseInt(e.target.value) };
                });
                break;
            case 'ageMax':
                if (eventInfo.ageMin >= parseInt(e.target.value)) {
                    return;
                }

                setEventInfo((oldVal) => {
                    return { ...oldVal, ageMax: parseInt(e.target.value) };
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
                            setSport('soccer');
                        }}
                    >
                        ⚽
                    </button>
                    <button
                        className="w-40 h-40 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl"
                        onClick={() => {
                            setSport('basketball');
                        }}
                    >
                        🏀
                    </button>
                    <button
                        className="w-40 h-40 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl"
                        onClick={() => {
                            setSport('tennis');
                        }}
                    >
                        🎾
                    </button>
                    <button
                        className="w-40 h-40 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl"
                        onClick={() => {
                            setSport('table tennis');
                        }}
                    >
                        🏓
                    </button>
                    <button
                        className="w-40 h-40 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl"
                        onClick={() => {
                            setSport('badminton');
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
                                    levels={eventInfo.soccerLevels}
                                    chooseLevel={(i) => {
                                        setEventInfo((oldVal) => {
                                            const newSoccerLevels: Set<number> =
                                                new Set(oldVal.soccerLevels);

                                            if (newSoccerLevels.has(i)) {
                                                newSoccerLevels.delete(i);
                                            } else {
                                                newSoccerLevels.add(i);
                                            }

                                            return {
                                                ...oldVal,
                                                soccerLevels: newSoccerLevels,
                                            };
                                        });
                                    }}
                                />
                            )}
                            {sport === 'basketball' && (
                                <LevelBarMulti
                                    levels={eventInfo.basketballLevels}
                                    chooseLevel={(i) => {
                                        setEventInfo((oldVal) => {
                                            const newBasketballLevels: Set<number> =
                                                new Set(
                                                    oldVal.basketballLevels
                                                );

                                            if (newBasketballLevels.has(i)) {
                                                newBasketballLevels.delete(i);
                                            } else {
                                                newBasketballLevels.add(i);
                                            }

                                            return {
                                                ...oldVal,
                                                basketballLevels:
                                                    newBasketballLevels,
                                            };
                                        });
                                    }}
                                />
                            )}
                            {sport === 'tennis' && (
                                <LevelBarMulti
                                    levels={eventInfo.tennisLevels}
                                    chooseLevel={(i) => {
                                        setEventInfo((oldVal) => {
                                            const newTennisLevels: Set<number> =
                                                new Set(oldVal.tennisLevels);

                                            if (newTennisLevels.has(i)) {
                                                newTennisLevels.delete(i);
                                            } else {
                                                newTennisLevels.add(i);
                                            }

                                            return {
                                                ...oldVal,
                                                tennisLevels: newTennisLevels,
                                            };
                                        });
                                    }}
                                />
                            )}
                            {sport === 'table tennis' && (
                                <LevelBarMulti
                                    levels={eventInfo.tableTennisLevels}
                                    chooseLevel={(i) => {
                                        setEventInfo((oldVal) => {
                                            const newTableTennisLevels: Set<number> =
                                                new Set(
                                                    oldVal.tableTennisLevels
                                                );

                                            if (newTableTennisLevels.has(i)) {
                                                newTableTennisLevels.delete(i);
                                            } else {
                                                newTableTennisLevels.add(i);
                                            }

                                            return {
                                                ...oldVal,
                                                tableTennisLevels:
                                                    newTableTennisLevels,
                                            };
                                        });
                                    }}
                                />
                            )}
                            {sport === 'badminton' && (
                                <LevelBarMulti
                                    levels={eventInfo.badmintonLevels}
                                    chooseLevel={(i) => {
                                        setEventInfo((oldVal) => {
                                            const newBadmintonLevels: Set<number> =
                                                new Set(oldVal.badmintonLevels);

                                            if (newBadmintonLevels.has(i)) {
                                                newBadmintonLevels.delete(i);
                                            } else {
                                                newBadmintonLevels.add(i);
                                            }

                                            return {
                                                ...oldVal,
                                                badmintonLevels:
                                                    newBadmintonLevels,
                                            };
                                        });
                                    }}
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
                                    value={eventInfo.location}
                                    onChange={(e) => {
                                        setEventInfo((oldVal) => {
                                            return {
                                                ...oldVal,
                                                location: e.target.value,
                                            };
                                        });
                                    }}
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
                            <input className="mr-2" type="date" />
                            <input type="time" />
                        </section>
                        <section className="w-full">
                            <h2 className="font-bold">選擇時長:</h2>
                        </section>
                        <section className="flex flex-col gap-2">
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
