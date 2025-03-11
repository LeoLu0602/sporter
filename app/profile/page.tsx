'use client';

import { useEmail } from '@/context/Context';
import { supabase } from '@/lib/utils';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import LevelBar from '@/components/LevelBar';
import { explainLevel } from '@/lib/utils';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function Profile() {
    const email = useEmail();
    const router = useRouter();
    const [info, setInfo] = useState<{
        username: string;
        gender: number;
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
        distance: 1000,
        intro: '',
        badmintonLevel: 0,
        basketballLevel: 0,
        soccerLevel: 0,
        tableTennisLevel: 0,
        tennisLevel: 0,
    });
    const [option, setOption] = useState<'info' | 'levels'>('info');
    const [birthday, setBirthday] = useState<Dayjs>(dayjs(''));

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

            setInfo({
                username,
                gender,
                distance,
                intro,
                badmintonLevel,
                basketballLevel,
                soccerLevel,
                tableTennisLevel,
                tennisLevel,
            });
            setBirthday(dayjs(birthday));
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
                        username: e.target.value,
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
            distance,
            intro,
            badmintonLevel: badminton_level,
            basketballLevel: basketball_level,
            soccerLevel: soccer_level,
            tableTennisLevel: table_tennis_level,
            tennisLevel: tennis_level,
        } = info;

        const { error } = await supabase
            .from('user')
            .update([
                {
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
                    className={clsx('flex flex-col gap-8', {
                        hidden: option !== 'info',
                    })}
                >
                    <section>
                        <span className="mr-4 outline-none decoration-transparent">
                            Email:
                        </span>
                        {email && (
                            <>
                                <span className="no-underline">{email}</span>
                                <button
                                    className="ml-4 text-rose-500 font-bold"
                                    onClick={signOut}
                                >
                                    登出
                                </button>
                            </>
                        )}
                    </section>
                    <section>
                        <label className="w-full focus:outline-none mr-4">
                            名稱:
                        </label>
                        <input
                            className="w-40"
                            type="text"
                            name="name"
                            value={info.username}
                            onChange={handleInfoChange}
                        />
                    </section>
                    <section className="flex gap-4">
                        <span>性別:</span>
                        <section>
                            <input
                                type="radio"
                                name="gender"
                                value="1"
                                checked={info.gender === 1}
                                onChange={handleInfoChange}
                            />
                            <label className="ml-4">男</label>
                        </section>
                        <section>
                            <input
                                type="radio"
                                name="gender"
                                value="2"
                                checked={info.gender === 2}
                                onChange={handleInfoChange}
                            />
                            <label className="ml-4">女</label>
                        </section>
                        <section>
                            <input
                                type="radio"
                                name="gender"
                                value="3"
                                checked={info.gender === 3}
                                onChange={handleInfoChange}
                            />
                            <label className="ml-4">不透漏</label>
                        </section>
                    </section>
                    <section>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    label="生日"
                                    value={birthday}
                                    onChange={(newDateVal) => {
                                        if (newDateVal) {
                                            setBirthday(newDateVal);
                                        }
                                    }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </section>
                    <section>
                        <label className="mr-4">距離偏好:</label>
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
                        <input
                            className="w-full mt-4"
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
                            className="mt-4 border-2 border-black w-full h-20 p-2 focus:outline-none"
                            name="intro"
                            value={info.intro}
                            onChange={handleInfoChange}
                        />
                    </section>
                </section>
                <section
                    className={clsx('flex flex-col gap-8', {
                        hidden: option !== 'levels',
                    })}
                >
                    <section>
                        <span className="text-2xl">
                            ⚽ {explainLevel(info.soccerLevel)}
                        </span>
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
                        <span className="text-2xl">
                            🏀 {explainLevel(info.basketballLevel)}
                        </span>
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
                        <span className="text-2xl">
                            🎾 {explainLevel(info.tennisLevel)}
                        </span>
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
                        <span className="text-2xl">
                            🏓 {explainLevel(info.tableTennisLevel)}
                        </span>
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
                        <span className="text-2xl">
                            🏸 {explainLevel(info.badmintonLevel)}
                        </span>
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
                    className="w-full mt-8 mb-24 py-2 bg-emerald-600 text-white font-bold rounded-xl"
                    onClick={save}
                >
                    儲存
                </button>
            </main>
        </>
    );
}
