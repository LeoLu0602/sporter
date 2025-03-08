'use client';

import { useEmail } from '@/context/Context';
import { supabase } from '@/lib/utils';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import LevelBar from '@/components/LevelBar';
import { explainLevel } from '@/utils/utils';

export default function Profile() {
    const email = useEmail();
    const router = useRouter();
    const [info, setInfo] = useState<{
        username: string;
        gender: number;
        birthday: Date | null;
        distance: number;
        intro: string;
        badmintonLevel: number;
        basketballLevel: number;
        soccerLevel: number;
        tableTennisLevel: number;
        tennisLevel: number;
    }>({
        username: 'user',
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
    const [option, setOption] = useState<'info' | 'levels'>('info');

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
                badminton_level,
                basketball_level,
                soccer_level,
                table_tennis_level,
                tennis_level,
            } = data[0];

            const [y, m, d] = birthday
                .split('-')
                .map((str: string) => parseInt(str));

            setInfo({
                username,
                gender,
                birthday: new Date(y, m - 1, d), // Month is zero-based, which is fucking stupid.
                distance,
                intro,
                badmintonLevel: badminton_level,
                basketballLevel: basketball_level,
                soccerLevel: soccer_level,
                tableTennisLevel: table_tennis_level,
                tennisLevel: tennis_level,
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
            case 'name':
                setInfo((oldVal) => {
                    return {
                        ...oldVal,
                        name: e.target.value,
                    };
                });
                break;
            case 'gender':
                setInfo((oldVal) => {
                    return {
                        ...oldVal,
                        gender: parseInt(e.target.value),
                    };
                });
                break;
            case 'birthday':
                setInfo((oldVal) => {
                    const [y, m, d] = e.target.value
                        .split('-')
                        .map((str) => parseInt(str));

                    // Month is zero-based, which is fucking stupid.
                    return { ...oldVal, birthday: new Date(y, m - 1, d) };
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

        const {
            username,
            gender,
            birthday,
            distance,
            intro,
            badmintonLevel,
            basketballLevel,
            soccerLevel,
            tableTennisLevel,
            tennisLevel,
        } = info;

        const { error } = await supabase
            .from('user')
            .update([
                {
                    username: username,
                    gender: gender,
                    birthday: birthday,
                    distance: distance,
                    intro: intro,
                    badminton_level: badmintonLevel,
                    basketball_level: basketballLevel,
                    soccer_level: soccerLevel,
                    table_tennis_level: tableTennisLevel,
                    tennis_level: tennisLevel,
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

    function changeOption(option: 'info' | 'levels') {
        setOption(option);
    }

    return (
        <>
            <header>
                <h1 className="p-8 text-center text-2xl font-bold">個人檔案</h1>
            </header>
            <nav className="mb-8 text-xl">
                <ul className="flex w-full justify-around">
                    <li
                        className={clsx('cursor-pointer', {
                            'border-b-2 border-b-black font-bold':
                                option === 'info',
                        })}
                        onClick={() => {
                            changeOption('info');
                        }}
                    >
                        基本資料
                    </li>
                    <li
                        className={clsx('cursor-pointer', {
                            'border-b-2 border-b-black font-bold':
                                option === 'levels',
                        })}
                        onClick={() => {
                            changeOption('levels');
                        }}
                    >
                        運動程度
                    </li>
                </ul>
            </nav>
            <main className="px-4 text-lg">
                <section
                    className={clsx('flex flex-col gap-4', {
                        hidden: option !== 'info',
                    })}
                >
                    <section>
                        <span className="font-bold">Email: </span>
                        {email && (
                            <>
                                {email}
                                <button
                                    className="ml-2 text-rose-500 font-bold"
                                    onClick={signOut}
                                >
                                    登出
                                </button>
                            </>
                        )}
                    </section>
                    <section>
                        <label className="font-bold w-full focus:outline-none">
                            名稱:{' '}
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={info.username}
                            onChange={handleInfoChange}
                        />
                    </section>
                    <section className="flex">
                        <span className="mr-4 font-bold">性別:</span>
                        <section>
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={info.gender === 1}
                                onChange={handleInfoChange}
                            />
                            <label className="mr-4 ml-2">男</label>
                        </section>
                        <section>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={info.gender === 2}
                                onChange={handleInfoChange}
                            />
                            <label className="mr-4 ml-2">女</label>
                        </section>
                        <section>
                            <input
                                type="radio"
                                name="gender"
                                value="prefer not to say"
                                checked={info.gender === 3}
                                onChange={handleInfoChange}
                            />
                            <label className="ml-2">不透漏</label>
                        </section>
                    </section>
                    <section>
                        <label className="font-bold">生日: </label>
                        <input
                            type="date"
                            name="birthday"
                            value={
                                info.birthday
                                    ? info.birthday.getFullYear().toString() +
                                      '-' +
                                      (info.birthday.getMonth() + 1)
                                          .toString()
                                          .padStart(2, '0') +
                                      '-' +
                                      info.birthday
                                          .getDate()
                                          .toString()
                                          .padStart(2, '0')
                                    : ''
                            }
                            onChange={handleInfoChange}
                        />
                    </section>
                    <section>
                        <label className="font-bold">距離偏好: </label>
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
                        <label className="font-bold">
                            自介 ({info.intro.length}/50){' '}
                        </label>
                        <br />
                        <textarea
                            className="mt-2 border-2 border-black w-full h-20 p-2 focus:outline-none"
                            name="intro"
                            value={info.intro}
                            onChange={handleInfoChange}
                        />
                    </section>
                </section>
                <section
                    className={clsx('flex flex-col gap-4 pt-4', {
                        hidden: option !== 'levels',
                    })}
                >
                    <section>
                        <h2 className="text-2xl">
                            ⚽ {explainLevel(info.soccerLevel)}
                        </h2>
                        <LevelBar
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
                    </section>
                    <section>
                        <h2 className="text-2xl">
                            🏀 {explainLevel(info.basketballLevel)}
                        </h2>
                        <LevelBar
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
                    </section>
                    <section>
                        <h2 className="text-2xl">
                            🎾 {explainLevel(info.tennisLevel)}
                        </h2>
                        <LevelBar
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
                    </section>
                    <section>
                        <h2 className="text-2xl">
                            🏓 {explainLevel(info.tableTennisLevel)}
                        </h2>
                        <LevelBar
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
                    </section>
                    <section>
                        <h2 className="text-2xl">
                            🏸 {explainLevel(info.badmintonLevel)}
                        </h2>
                        <LevelBar
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
                </section>
                <button
                    className="mt-4 mb-20 px-8 py-2 bg-emerald-500 text-white font-bold"
                    onClick={save}
                >
                    儲存
                </button>
            </main>
        </>
    );
}
