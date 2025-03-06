'use client';

import { useState } from 'react';
import LevelBar from '@/components/LevelBar';

export default function New() {
    const [sport, setSport] = useState<string | null>(null);

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
                        className="w-36 h-36 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl"
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
                                className="border-black border-2 px-8"
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
                            <LevelBar level={0} chooseLevel={(i) => {}} />
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
                                className="border-2 border-black px-8 py-2 bg-emerald-600 text-white"
                                onClick={() => {
                                    setSport(null);
                                }}
                            >
                                取消
                            </button>
                            <button
                                className="border-2 border-black px-8 py-2 bg-sky-600 text-white"
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
