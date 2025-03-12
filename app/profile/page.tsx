'use client';

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
import TextField from '@mui/material/TextField';
import { useUser, useUserDispatch } from '@/context/Context';

export default function Profile() {
    const user = useUser();
    const userDispatch = useUserDispatch();
    const router = useRouter();
    const [option, setOption] = useState<'info' | 'levels'>('info');
    const [birthday, setBirthday] = useState<Dayjs | null>(null);

    useEffect(() => {
        if (user) {
            setBirthday(dayjs(user.birthday));
        }
    }, [user]);

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
        if (!user || !userDispatch) {
            return;
        }

        switch (e.target.name) {
            case 'name':
                userDispatch({
                    user: {
                        ...user,
                        username: e.target.value,
                    },
                });
                break;
            case 'gender':
                userDispatch({
                    user: {
                        ...user,
                        gender: parseInt(e.target.value),
                    },
                });
                break;
            case 'distance':
                userDispatch({
                    user: {
                        ...user,
                        distance: parseInt(e.target.value),
                    },
                });
                break;
            case 'intro':
                if (e.target.value.length <= 50) {
                    userDispatch({
                        user: {
                            ...user,
                            intro: e.target.value,
                        },
                    });
                }
                break;
        }
    }

    async function save() {
        if (!user) {
            return;
        }

        const { error } = await supabase
            .from('user')
            .update([
                {
                    ...user,
                    birthday: birthday?.format('YYYY-MM-DD') ?? null,
                },
            ])
            .eq('id', user.id);

        if (error) {
            alert('Error!');
            console.error(error);

            return;
        }

        alert('儲存成功!');
    }

    function changeOption(option: 'info' | 'levels') {
        setOption(option);
    }

    if (!user || !userDispatch) {
        return <></>;
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
                        <span className="no-underline">
                            {user?.email ?? ''}
                        </span>
                    </section>
                    <section>
                        <label className="w-full focus:outline-none mr-4">
                            名稱:
                        </label>
                        <input
                            className="w-40"
                            type="text"
                            name="name"
                            value={user.username}
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
                                checked={user.gender === 1}
                                onChange={handleInfoChange}
                            />
                            <label className="ml-4">男</label>
                        </section>
                        <section>
                            <input
                                type="radio"
                                name="gender"
                                value="2"
                                checked={user.gender === 2}
                                onChange={handleInfoChange}
                            />
                            <label className="ml-4">女</label>
                        </section>
                        <section>
                            <input
                                type="radio"
                                name="gender"
                                value="3"
                                checked={user.gender === 3}
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
                                            userDispatch({
                                                user: {
                                                    ...user,
                                                    birthday:
                                                        newDateVal?.format(
                                                            'YYYY-MM-DD'
                                                        ) ?? null,
                                                },
                                            });
                                        }
                                    }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </section>
                    <section>
                        <label className="mr-4">距離偏好:</label>
                        <span>
                            {user.distance >= 1000
                                ? Math.floor(user.distance / 1000).toString() +
                                  ',' +
                                  (user.distance % 1000)
                                      .toString()
                                      .padStart(3, '0')
                                : user.distance.toString()}{' '}
                            公尺
                        </span>
                        <div className="flex justify-center">
                            <input
                                className="w-11/12 mt-4"
                                type="range"
                                name="distance"
                                min="500"
                                max="10000"
                                step="100"
                                value={user.distance.toString()}
                                onChange={handleInfoChange}
                            />
                        </div>
                    </section>
                    <section>
                        <label className="block mb-4">
                            自介 ({user.intro.length}/50){' '}
                        </label>
                        <TextField
                            className="w-full"
                            name="intro"
                            multiline
                            value={user.intro}
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
                            ⚽ {explainLevel(user.soccer_level)}
                        </span>
                        <LevelBar
                            level={user.soccer_level}
                            chooseLevel={(i) => {
                                userDispatch({
                                    user: {
                                        ...user,
                                        soccer_level: i,
                                    },
                                });
                            }}
                        />
                    </section>
                    <section>
                        <span className="text-2xl">
                            🏀 {explainLevel(user.basketball_level)}
                        </span>
                        <LevelBar
                            level={user.basketball_level}
                            chooseLevel={(i) => {
                                userDispatch({
                                    user: {
                                        ...user,
                                        basketball_level: i,
                                    },
                                });
                            }}
                        />
                    </section>
                    <section>
                        <span className="text-2xl">
                            🎾 {explainLevel(user.tennis_level)}
                        </span>
                        <LevelBar
                            level={user.tennis_level}
                            chooseLevel={(i) => {
                                userDispatch({
                                    user: {
                                        ...user,
                                        tennis_level: i,
                                    },
                                });
                            }}
                        />
                    </section>
                    <section>
                        <span className="text-2xl">
                            🏓 {explainLevel(user.table_tennis_level)}
                        </span>
                        <LevelBar
                            level={user.table_tennis_level}
                            chooseLevel={(i) => {
                                userDispatch({
                                    user: {
                                        ...user,
                                        table_tennis_level: i,
                                    },
                                });
                            }}
                        />
                    </section>
                    <section>
                        <span className="text-2xl">
                            🏸 {explainLevel(user.badminton_level)}
                        </span>
                        <LevelBar
                            level={user.badminton_level}
                            chooseLevel={(i) => {
                                userDispatch({
                                    user: {
                                        ...user,
                                        badminton_level: i,
                                    },
                                });
                            }}
                        />
                    </section>
                </section>
                <button
                    className="w-full my-8 py-2 border-2 border-emerald-500 text-emerald-500"
                    onClick={save}
                >
                    儲存
                </button>
                <button
                    className="text-rose-500 border-rose-500 border-2 py-2 w-full mb-24"
                    onClick={signOut}
                >
                    登出
                </button>
            </main>
        </>
    );
}
