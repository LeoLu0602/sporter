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
        gender: 'male' | 'female';
        birthday: Date;
        distance: number;
        intro: string;
    } | null>(null);
    const [tab, setTab] = useState<'info' | 'level'>('info');

    async function signOut() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            alert('Error!');
            console.error(error);
        } else {
            router.push('/');
        }
    }

    function handleInfoChange(e: ChangeEvent<HTMLInputElement>) {}

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
                            'border-b-2 border-b-black': tab === 'info',
                        })}
                        onClick={() => {
                            setTab('info');
                        }}
                    >
                        基本資料
                    </div>
                    <div
                        className={clsx('cursor-pointer', {
                            'border-b-2 border-b-black': tab === 'level',
                        })}
                        onClick={() => {
                            setTab('level');
                        }}
                    >
                        運動程度
                    </div>
                </div>
                <section
                    className={clsx('flex flex-col gap-4', {
                        hidden: tab !== 'info',
                    })}
                >
                    <section>Email: {email ?? ''}</section>
                    <section>
                        <label>名稱: </label>
                        <input
                            name="name"
                            type="text"
                            value={info?.name ?? ''}
                            onChange={handleInfoChange}
                        />
                    </section>
                    <section className="flex">
                        <section className="mr-4">性別:</section>
                        <section>
                            <input
                                type="radio"
                                id="male"
                                name="gender"
                                value="male"
                            />
                            <label className="mr-8 ml-2" htmlFor="male">
                                男
                            </label>
                        </section>
                        <section>
                            <input
                                type="radio"
                                id="female"
                                name="gender"
                                value="female"
                            />
                            <label className="ml-2" htmlFor="female">
                                女
                            </label>
                        </section>
                    </section>
                    <section>
                        <label>生日: </label>
                        <input type="date" />
                    </section>
                    <section>
                        <label>距離偏好: </label>
                        <span>1000 公尺</span>
                        <br />
                        <br />
                        <input type="range" />
                    </section>
                    <section>
                        <label>自介: </label>
                        <br />
                        <textarea className="border-2 border-black w-full h-20" />
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
