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
    const [file, setFile] = useState<File | null>(null);

    async function signOut() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            alert('Error!');
            console.error(error);

            return;
        }

        window.location.replace('/');
    }

    async function updateProfilePic(
        userId: string,
        file: File
    ): Promise<string | null> {
        const { error } = await supabase.storage
            .from('profile-pics')
            .update(`/${userId}`, file, { upsert: true });

        if (error) {
            alert('Error');
            console.error(error);

            return null;
        }

        const { data } = supabase.storage
            .from('profile-pics')
            .getPublicUrl(`/${userId}`);

        return data.publicUrl;
    }

    async function save() {
        if (!user || !userDispatch) {
            return;
        }

        const publicUrl = file ? await updateProfilePic(user.id, file) : null;
        const { error } = await supabase
            .from('user')
            .update([
                {
                    ...user,
                    img: publicUrl ?? user.img,
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
            <nav className="py-4 text-xl border-b-[1px] border-gray-200 sticky left-0 top-0 bg-white z-30">
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
            <main className="px-4 pt-8 pb-20 text-lg">
                {user && userDispatch ? (
                    <>
                        {option === 1 ? (
                            <InfoSettings file={file} setFile={setFile} />
                        ) : (
                            <Levels />
                        )}
                        <div className="flex flex-col items-center">
                            <button
                                className="mb-8 py-2 w-80 border-2 border-emerald-500 text-emerald-500"
                                onClick={save}
                            >
                                儲存
                            </button>
                            <button
                                className="text-rose-500 border-rose-500 border-2 py-2 w-80"
                                onClick={signOut}
                            >
                                登出
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="mt-8 flex justify-center">
                        <CircularProgress />
                    </div>
                )}
            </main>
        </>
    );
}
