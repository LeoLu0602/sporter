'use client';

import { useEmail } from '@/context/Context';
import { supabase } from '@/lib/utils';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

export default function Profile() {
    const email = useEmail();
    const router = useRouter();
    const [info, setInfo] = useState<{
        name: string;
        gender: 'male' | 'female' | 'prefer not to say';
        birthday: string;
        distance: number;
        intro: string;
    }>({
        name: '',
        gender: 'prefer not to say',
        birthday: '',
        distance: 1000,
        intro: '',
    });
    const [option, setOption] = useState<'info' | 'level'>('info');

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
                    return { ...oldVal, name: e.target.value };
                });
                break;
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

    async function save() {}

    return (
        <>
            <main className="p-4">
                <h1 className="text-center pb-4 border-b-black border-b-2 text-2xl">
                    個人檔案
                </h1>
                <div className="flex w-full justify-around p-4">
                    <div
                        className={clsx('cursor-pointer', {
                            'border-b-2 border-b-black': option === 'info',
                        })}
                        onClick={() => {
                            setOption('info');
                        }}
                    >
                        基本資料
                    </div>
                    <div
                        className={clsx('cursor-pointer', {
                            'border-b-2 border-b-black': option === 'level',
                        })}
                        onClick={() => {
                            setOption('level');
                        }}
                    >
                        運動程度
                    </div>
                </div>
                <section
                    className={clsx('flex flex-col gap-4', {
                        hidden: option !== 'info',
                    })}
                >
                    <section>Email: {email ?? ''}</section>
                    <section>
                        <label>名稱: </label>
                        <input
                            name="name"
                            type="text"
                            value={info.name}
                            onChange={handleInfoChange}
                        />
                    </section>
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
                        <span>{info.distance} 公尺</span>
                        <br />
                        <br />
                        <input
                            className="w-full"
                            type="range"
                            name="distance"
                            min="0"
                            max="5000"
                            step="100"
                            value={info.distance}
                            onChange={handleInfoChange}
                        />
                    </section>
                    <section>
                        <label>自介 ({info.intro.length}/50) </label>
                        <br />
                        <textarea
                            className="mt-2 border-2 border-black w-full h-20"
                            name="intro"
                            value={info.intro}
                            onChange={handleInfoChange}
                        />
                    </section>
                </section>
                <button
                    className="fixed bottom-20 left-4 border-2 border-black px-8 py-2"
                    onClick={signOut}
                >
                    登出
                </button>
                <button
                    className="fixed bottom-20 right-4 border-2 border-black px-8 py-2"
                    onClick={save}
                >
                    儲存
                </button>
            </main>
        </>
    );
}
