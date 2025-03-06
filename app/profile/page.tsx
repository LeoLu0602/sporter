'use client';

import { useEmail } from '@/context/Context';
import { supabase } from '@/lib/utils';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import Level from './Level';
import LevelBar from './LevelBar';

export default function Profile() {
    const email = useEmail();
    const router = useRouter();
    const [info, setInfo] = useState<{
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
    const [option, setOption] = useState<'info' | 'levels'>('info');

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

            setInfo({
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
        }

        setUp();
    }, [email]);

    async function signOut() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            alert('Error!');
            console.error(error);
        } else {
            router.push('/');
        }
    }

    function handleInfoChange(
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        switch (e.target.name) {
            case 'gender':
                setInfo((oldVal) => {
                    return {
                        ...oldVal,
                        gender: e.target.value as 'male' | 'female',
                    };
                });
                break;
            case 'birthday':
                setInfo((oldVal) => {
                    return { ...oldVal, birthday: e.target.value };
                });
                break;
            case 'distance':
                setInfo((oldVal) => {
                    return { ...oldVal, distance: Number(e.target.value) };
                });
                break;
            case 'intro':
                if (e.target.value.length <= 50) {
                    setInfo((oldVal) => {
                        return { ...oldVal, intro: e.target.value };
                    });
                }

                break;
        }
    }

    async function save() {
        if (!email) {
            return;
        }

        const { error } = await supabase
            .from('profile')
            .update([
                {
                    username: info.name,
                    gender:
                        info.gender === 'male'
                            ? 1
                            : info.gender === 'female'
                              ? 2
                              : 3,
                    birthday: info.birthday,
                    distance: info.distance,
                    intro: info.intro,
                    badminton_level: info.badmintonLevel,
                    basketball_level: info.basketballLevel,
                    soccer_level: info.soccerLevel,
                    table_tennis_level: info.tableTennisLevel,
                    tennis_level: info.tennisLevel,
                },
            ])
            .eq('email', email);

        if (error) {
            alert('Error!');
            console.error(error);

            return;
        }

        alert('Saved!');
    }

    return (
        <>
            <main className="p-4 min-h-screen">
                <h1 className="text-center pb-4 border-b-black border-b-2 text-2xl">
                    個人檔案
                </h1>
                <section className="flex w-full justify-around p-4">
                    <section
                        className={clsx('cursor-pointer', {
                            'border-b-2 border-b-black': option === 'info',
                        })}
                        onClick={() => {
                            setOption('info');
                        }}
                    >
                        基本資料
                    </section>
                    <section
                        className={clsx('cursor-pointer', {
                            'border-b-2 border-b-black': option === 'levels',
                        })}
                        onClick={() => {
                            setOption('levels');
                        }}
                    >
                        運動程度
                    </section>
                </section>
                <section
                    className={clsx('flex flex-col gap-4 mb-40', {
                        hidden: option !== 'info',
                    })}
                >
                    <section>Email: {email ?? ''}</section>
                    <section>名稱: {info.name}</section>
                    <section className="flex">
                        <section className="mr-4">性別:</section>
                        <section>
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={info.gender === 'male'}
                                onChange={handleInfoChange}
                            />
                            <label className="mr-4 ml-2">男</label>
                        </section>
                        <section>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={info.gender === 'female'}
                                onChange={handleInfoChange}
                            />
                            <label className="mr-4 ml-2">女</label>
                        </section>
                        <section>
                            <input
                                type="radio"
                                name="gender"
                                value="prefer not to say"
                                checked={info.gender === 'prefer not to say'}
                                onChange={handleInfoChange}
                            />
                            <label className="ml-2">不透漏</label>
                        </section>
                    </section>
                    <section>
                        <label>生日: </label>
                        <input
                            type="date"
                            name="birthday"
                            value={info.birthday}
                            onChange={handleInfoChange}
                        />
                    </section>
                    <section>
                        <label>距離偏好: </label>
                        <span>
                            {info.distance >= 1000
                                ? Math.floor(info.distance / 1000).toString() +
                                  ',' +
                                  (info.distance % 1000)
                                      .toString()
                                      .padStart(3, '0')
                                : info.distance.toString()}{' '}
                            公尺
                        </span>
                        <br />
                        <br />
                        <input
                            className="w-full"
                            type="range"
                            name="distance"
                            min="500"
                            max="10000"
                            step="100"
                            value={info.distance.toString()}
                            onChange={handleInfoChange}
                        />
                    </section>
                    <section>
                        <label>自介 ({info.intro.length}/50) </label>
                        <br />
                        <textarea
                            className="mt-2 border-2 border-black w-full h-20 p-2"
                            name="intro"
                            value={info.intro}
                            onChange={handleInfoChange}
                        />
                    </section>
                </section>
                <section
                    className={clsx('flex flex-col gap-4 pt-4 mb-40', {
                        hidden: option !== 'levels',
                    })}
                >
                    <LevelBar
                        sport="⚽"
                        level={info.soccerLevel}
                        chooseLevel={(i) => {
                            setInfo((oldVal) => {
                                return {
                                    ...oldVal,
                                    soccerLevel: i,
                                };
                            });
                        }}
                    />
                    <LevelBar
                        sport="🏀"
                        level={info.basketballLevel}
                        chooseLevel={(i) => {
                            setInfo((oldVal) => {
                                return {
                                    ...oldVal,
                                    basketballLevel: i,
                                };
                            });
                        }}
                    />
                    <LevelBar
                        sport="🎾"
                        level={info.tennisLevel}
                        chooseLevel={(i) => {
                            setInfo((oldVal) => {
                                return {
                                    ...oldVal,
                                    tennisLevel: i,
                                };
                            });
                        }}
                    />
                    <LevelBar
                        sport="🏓"
                        level={info.tableTennisLevel}
                        chooseLevel={(i) => {
                            setInfo((oldVal) => {
                                return {
                                    ...oldVal,
                                    tableTennisLevel: i,
                                };
                            });
                        }}
                    />
                    <LevelBar
                        sport="🏸"
                        level={info.badmintonLevel}
                        chooseLevel={(i) => {
                            setInfo((oldVal) => {
                                return {
                                    ...oldVal,
                                    badmintonLevel: i,
                                };
                            });
                        }}
                    />
                </section>
                <button
                    className="fixed bottom-20 left-4 border-2 border-black px-8 py-2 bg-white z-20"
                    onClick={signOut}
                >
                    登出
                </button>
                <button
                    className="fixed bottom-20 right-4 border-2 border-black px-8 py-2 bg-white z-20"
                    onClick={save}
                >
                    儲存
                </button>
            </main>
        </>
    );
}
