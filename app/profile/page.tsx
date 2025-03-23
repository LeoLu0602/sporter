'use client';

import { supabase } from '@/lib/utils';
import clsx from 'clsx';
import { useUser, useUserDispatch } from '@/context/Context';
import Levels from '@/components/Levels';
import InfoSettings from '@/components/InfoSettings';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';

export default function Profile() {
    const user = useUser();
    const userDispatch = useUserDispatch();
    const [option, setOption] = useState<number>(1);

    async function signOut() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            alert('Error!');
            console.error(error);

            return;
        }

        window.location.replace('/');
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
                },
            ])
            .eq('id', user.id);

        if (error) {
            alert('Error!');
            console.error(error);

            return;
        }

        window.location.reload();
    }

    return (
        <>
            <nav className="py-4 text-xl border-b-[1px] border-gray-200">
                <ul className="flex w-full justify-around">
                    {[
                        { i: 1, txt: '基本資料' },
                        { i: 2, txt: '運動程度' },
                    ].map(({ i, txt }) => (
                        <li
                            key={i}
                            className={clsx('cursor-pointer', {
                                'border-b-2 border-b-black text-black':
                                    option === i,
                                'text-gray-500': option !== i,
                            })}
                            onClick={() => {
                                setOption(i);
                            }}
                        >
                            {txt}
                        </li>
                    ))}
                </ul>
            </nav>
            <main className="px-4 py-8 text-lg">
                {user && userDispatch ? (
                    <>
                        {option === 1 ? <InfoSettings /> : <Levels />}
                        <button
                            className="w-full my-8 py-2 border-2 border-emerald-500 text-emerald-500"
                            onClick={save}
                        >
                            儲存
                        </button>
                        <button
                            className="text-rose-500 border-rose-500 border-2 py-2 w-full"
                            onClick={signOut}
                        >
                            登出
                        </button>
                    </>
                ) : (
                    <div className="mt-4 flex justify-center">
                        <CircularProgress />
                    </div>
                )}
            </main>
        </>
    );
}
