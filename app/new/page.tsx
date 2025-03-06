'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/utils';
import { useEmail } from '@/context/Context';
import LevelBarMulti from '@/components/LevelBarMulti';

export default function New() {
    const email = useEmail();
    const [sport, setSport] = useState<string | null>(null);
    const [filter, setFilter] = useState<{
        gender: 'male' | 'female' | 'prefer not to say';
        birthday: string;
        distance: number;
        badmintonLevels: Set<number>;
        basketballLevels: Set<number>;
        soccerLevels: Set<number>;
        tableTennisLevels: Set<number>;
        tennisLevels: Set<number>;
    }>({
        gender: 'prefer not to say',
        birthday: '',
        distance: 500,
        badmintonLevels: new Set([0]),
        basketballLevels: new Set([0]),
        soccerLevels: new Set([0]),
        tableTennisLevels: new Set([0]),
        tennisLevels: new Set([0]),
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

            setFilter({
                gender:
                    data[0].gender === 1
                        ? 'male'
                        : data[0].gender === 2
                          ? 'female'
                          : 'prefer not to say',
                birthday: data[0].birthday,
                distance: data[0].distance,
                badmintonLevels: new Set([data[0].badminton_level]),
                basketballLevels: new Set([data[0].basketball_level]),
                soccerLevels: new Set([data[0].soccer_level]),
                tableTennisLevels: new Set([data[0].table_tennis_level]),
                tennisLevels: new Set([data[0].tennis_level]),
            });
        }

        setUp();
    }, [email]);

    function editTitle() {}

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
                        className="w-36 h-36 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl"
                        onClick={() => {
                            setSport('basketball');
                        }}
                    >
                        🏀
                    </button>
                    <button
                        className="w-36 h-36 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl"
                        onClick={() => {
                            setSport('tennis');
                        }}
                    >
                        🎾
                    </button>
                    <button
                        className="w-36 h-36 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl"
                        onClick={() => {
                            setSport('table tennis');
                        }}
                    >
                        🏓
                    </button>
                    <button
                        className="w-36 h-36 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl"
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
                                        <span className="text-2xl">足球</span>
                                    </>
                                )}
                                {sport === 'basketball' && (
                                    <>
                                        <h2 className="text-2xl">🏀</h2>
                                        <span className="text-2xl">籃球</span>
                                    </>
                                )}
                                {sport === 'tennis' && (
                                    <>
                                        <h2 className="text-2xl">🎾</h2>
                                        <span className="text-2xl">網球</span>
                                    </>
                                )}
                                {sport === 'table tennis' && (
                                    <>
                                        <h2 className="text-2xl">🏓</h2>
                                        <span className="text-2xl">桌球</span>
                                    </>
                                )}
                                {sport === 'badminton' && (
                                    <>
                                        <h2 className="text-2xl">🏸</h2>
                                        <span className="text-2xl">羽球</span>
                                    </>
                                )}
                            </div>

                            <button
                                className="text-orange-500 font-bold"
                                onClick={() => {
                                    editTitle();
                                }}
                            >
                                編輯名稱
                            </button>
                        </section>
                    </section>
                    <section className="flex flex-col items-center gap-4">
                        <section className="w-full">
                            <h2>選擇對手程度</h2>
                            {sport === 'soccer' && (
                                <LevelBarMulti
                                    levels={filter.soccerLevels}
                                    chooseLevel={(i) => {
                                        setFilter((oldVal) => {
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
                                    levels={filter.basketballLevels}
                                    chooseLevel={(i) => {
                                        setFilter((oldVal) => {
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
                                    levels={filter.tennisLevels}
                                    chooseLevel={(i) => {
                                        setFilter((oldVal) => {
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
                                    levels={filter.tableTennisLevels}
                                    chooseLevel={(i) => {
                                        setFilter((oldVal) => {
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
                                    levels={filter.badmintonLevels}
                                    chooseLevel={(i) => {
                                        setFilter((oldVal) => {
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
                        <section className="w-full">
                            <h2>選擇對手性別</h2>
                        </section>
                        <section className="w-full">
                            <h2>選擇對手年紀</h2>
                        </section>
                        <section className="w-full">
                            <h2>選擇地點</h2>
                        </section>
                        <section className="w-full">
                            <h2>需求人數: 1</h2>
                        </section>
                        <section className="w-full">
                            <h2>選擇時間</h2>
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
                                className="px-8 py-2 bg-sky-500 font-bold text-white"
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
