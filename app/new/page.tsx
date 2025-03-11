'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import {
    supabase,
    getSportEmoji,
    parseCoord,
    explainLevel,
    calculateAge,
} from '@/lib/utils';
import { useEmail } from '@/context/Context';
import Slider from '@mui/material/Slider';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import MapContainer from '@/components/MapContainer';

export default function New() {
    const email = useEmail();
    const [sport, setSport] = useState<string | null>(null);
    const [coordinate, setCoordinate] = useState<string>('');
    const [ages, setAges] = useState<number[]>([0, 100]);
    const [levels, setLevels] = useState<number[]>([1, 6]);
    const [userInfo, setUserInfo] = useState<{
        username: string;
        gender: number; // 1: male, 2: female, 3: any
        birthday: Date | null;
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
        birthday: null,
        distance: 1000,
        intro: '',
        badmintonLevel: 0,
        basketballLevel: 0,
        soccerLevel: 0,
        tableTennisLevel: 0,
        tennisLevel: 0,
    });
    const [eventInfo, setEventInfo] = useState<{
        sport: string | null;
        title: string;
        gender: number; // 1: male, 2: female, 3: any
        ageMin: number;
        ageMax: number;
        levelMin: number;
        levelMax: number;
        lat: number | null;
        lng: number | null;
        location: string;
        participantLimit: number;
    }>({
        sport: null,
        title: '未命名',
        gender: 3,
        ageMin: 0,
        ageMax: 100,
        levelMin: 1,
        levelMax: 6,
        lat: null,
        lng: null,
        location: '',
        participantLimit: 1,
    });
    const [startTime, setStartTime] = useState<Dayjs>(dayjs());
    const [endTime, setEndTime] = useState<Dayjs>(dayjs());
    const [showMap, setShowMap] = useState<boolean>(false);

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

            const [y, m, d] = birthday
                .split('-')
                .map((str: string) => parseInt(str));

            setUserInfo({
                username,
                gender,
                birthday: new Date(y, m - 1, d), // Month is zero-based, which is fucking stupid.
                distance,
                intro,
                badmintonLevel,
                basketballLevel,
                soccerLevel,
                tableTennisLevel,
                tennisLevel,
            });
        }

        setUp();
    }, [email]);

    function selectSport(sport: string) {
        const age: number = userInfo.birthday
            ? calculateAge(userInfo.birthday)
            : 20;
        const level: number =
            sport === 'soccer'
                ? userInfo.soccerLevel
                : sport === 'basketball'
                  ? userInfo.basketballLevel
                  : sport === 'tennis'
                    ? userInfo.tennisLevel
                    : sport === 'table tennis'
                      ? userInfo.tableTennisLevel
                      : userInfo.badmintonLevel;

        setSport(sport);
        setEventInfo({
            sport,
            title: '未命名',
            gender: userInfo.gender,
            ageMin: Math.max(0, age - 5),
            ageMax: Math.min(100, age + 5),
            levelMin: Math.max(1, level),
            levelMax: Math.max(1, level),
            lat: null,
            lng: null,
            location: '',
            participantLimit: 1,
        });
        setCoordinate('');
        setAges([Math.max(0, age - 5), Math.min(100, age + 5)]);
        setLevels([level, level]);
    }

    function handleCoordinateUpdate(e: ChangeEvent<HTMLInputElement>) {
        const parsedCoord = parseCoord(e.target.value);

        setCoordinate(e.target.value);

        if (parsedCoord) {
            const { lat, lng } = parsedCoord;

            setEventInfo((oldVal) => {
                return {
                    ...oldVal,
                    lat,
                    lng,
                };
            });
        }
    }

    function handleAgesChange(event: Event, newAges: number | number[]) {
        const [newAgeMin, newAgeMax]: number[] = newAges as number[];

        setAges(newAges as number[]);
        setEventInfo((oldVal) => {
            return {
                ...oldVal,
                ageMin: newAgeMin,
                ageMax: newAgeMax,
            };
        });
    }

    function handleLevelsChange(event: Event, newLevels: number | number[]) {
        const [newLevelMin, newLevelMax]: number[] = newLevels as number[];

        setLevels(newLevels as number[]);
        setEventInfo((oldVal) => {
            return {
                ...oldVal,
                levelMin: newLevelMin,
                levelMax: newLevelMax,
            };
        });
    }

    function incrementParticipantLimit(amount: number) {
        const newParticipantLimit: number = eventInfo.participantLimit + amount;

        if (newParticipantLimit >= 1 && newParticipantLimit <= 99) {
            setEventInfo((oldVal) => {
                return { ...oldVal, participantLimit: newParticipantLimit };
            });
        }
    }

    function handleEventInfoChange(e: ChangeEvent<HTMLInputElement>) {
        switch (e.target.name) {
            case 'title':
                setEventInfo((oldVal) => {
                    return { ...oldVal, title: e.target.value };
                });
                break;
            case 'gender':
                setEventInfo((oldVal) => {
                    return { ...oldVal, gender: parseInt(e.target.value) };
                });
                break;
            case 'location':
                setEventInfo((oldVal) => {
                    return { ...oldVal, location: e.target.value };
                });
                return;
            case 'startTime':
                setEventInfo((oldVal) => {
                    return { ...oldVal, startTime: new Date(e.target.value) };
                });
                break;
            case 'endTime':
                setEventInfo((oldVal) => {
                    return { ...oldVal, endTime: new Date(e.target.value) };
                });
                break;
        }
    }

    async function createNewEvent() {
        if (!email || !eventInfo.lat || !eventInfo.lng) {
            return;
        }

        const {
            sport,
            title,
            gender,
            ageMin: age_min,
            ageMax: age_max,
            levelMin: level_min,
            levelMax: level_max,
            lat,
            lng,
            location,
            participantLimit: participant_limit,
        } = eventInfo;

        const { error } = await supabase.from('event').insert([
            {
                email,
                sport,
                title,
                gender,
                age_min,
                age_max,
                level_min,
                level_max,
                lat,
                lng,
                location,
                participant_limit,
                remaining_spots: participant_limit,
                start_time: startTime,
                end_time: endTime,
            },
        ]);

        if (error) {
            alert('Error!');
            console.error(error);

            return;
        }

        window.location.replace('/event');
    }

    function openMap() {
        setShowMap(true);
    }

    function closeMap() {
        setShowMap(false);
    }

    return (
        <>
            <header>
                <h1 className="text-center p-8 text-2xl font-bold">揪運動</h1>
            </header>
            <main className="px-4">
                {showMap && (
                    <div className="fixed left-0 top-0 w-full h-screen z-50">
                        <MapContainer
                            setLatLng={({ lat, lng }) => {
                                setCoordinate(`(${lat},${lng})`);
                                setEventInfo((oldVal) => {
                                    return { ...oldVal, lat, lng };
                                });
                            }}
                            closeMap={closeMap}
                        />
                    </div>
                )}
                {sport === null && (
                    <section className="flex flex-wrap justify-between gap-8 mb-24">
                        {[
                            'soccer',
                            'basketball',
                            'tennis',
                            'table tennis',
                            'badminton',
                        ].map((sport) => (
                            <button
                                className="w-40 h-40 rounded-xl cursor-pointer flex justify-center items-center bg-[#ddd] text-6xl"
                                key={sport}
                                onClick={() => {
                                    selectSport(sport);
                                }}
                            >
                                {getSportEmoji(sport)}
                            </button>
                        ))}
                    </section>
                )}
                {sport !== null && (
                    <section className="flex flex-col gap-8 text-lg mb-24">
                        <section>
                            <h2 className="text-2xl inline mr-4">
                                {getSportEmoji(sport)}
                            </h2>
                            <input
                                className="text-2xl w-60 focus:outline-none"
                                name="title"
                                value={eventInfo.title}
                                onChange={handleEventInfoChange}
                            />
                        </section>
                        <section className="w-full flex flex-col gap-4">
                            <h2>
                                <b className="mr-4">對手程度:</b>
                                {explainLevel(eventInfo.levelMin) +
                                    ' 到 ' +
                                    explainLevel(eventInfo.levelMax)}
                            </h2>
                            <div className="px-4">
                                <Slider
                                    value={levels}
                                    onChange={handleLevelsChange}
                                    min={1}
                                    max={6}
                                    valueLabelDisplay="auto"
                                />
                            </div>
                        </section>
                        <section className="flex gap-4">
                            <h2 className="font-bold">對手性別:</h2>
                            <section>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="1"
                                    checked={eventInfo.gender === 1}
                                    onChange={handleEventInfoChange}
                                />
                                <label className="ml-2">男</label>
                            </section>
                            <section>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="2"
                                    checked={eventInfo.gender === 2}
                                    onChange={handleEventInfoChange}
                                />
                                <label className="ml-2">女</label>
                            </section>
                            <section>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="3"
                                    checked={eventInfo.gender === 3}
                                    onChange={handleEventInfoChange}
                                />
                                <label className="ml-2">不限</label>
                            </section>
                        </section>
                        <section>
                            <label className="block mb-4">
                                <b className="mr-4">對手年紀:</b>
                                {ages[0]} - {ages[1]}
                            </label>
                            <div className="px-4">
                                <Slider
                                    value={ages}
                                    onChange={handleAgesChange}
                                    min={0}
                                    max={100}
                                    valueLabelDisplay="auto"
                                />
                            </div>
                        </section>
                        <section>
                            <label className="font-bold block">
                                <span
                                    className="text-emerald-600 cursor-pointer"
                                    onClick={() => {
                                        openMap();
                                    }}
                                >
                                    開啟地圖
                                </span>{' '}
                                or 輸入座標 (經度，緯度)
                            </label>
                            <input
                                className="border-2 border-black focus:outline-none p-2 mt-4 w-full"
                                type="text"
                                value={coordinate}
                                onChange={handleCoordinateUpdate}
                            />
                        </section>
                        <section>
                            <label className="font-bold block">地點名稱:</label>
                            <input
                                className="border-2 border-black focus:outline-none p-2 w-full mt-4"
                                type="text"
                                name="location"
                                value={eventInfo.location}
                                onChange={handleEventInfoChange}
                            />
                        </section>
                        <section className="flex items-center gap-4">
                            <h2 className="font-bold mr-4">需求人數:</h2>
                            <button
                                className="bg-rose-500 w-6 h-6 text-white font-bold flex justify-center items-center rounded-full"
                                onClick={() => {
                                    incrementParticipantLimit(-1);
                                }}
                            >
                                &#8722;
                            </button>
                            <div className="w-20 text-center">
                                {eventInfo.participantLimit}
                            </div>
                            <button
                                className="bg-emerald-500 w-6 h-6 text-white font-bold flex justify-center items-center rounded-full"
                                onClick={() => {
                                    incrementParticipantLimit(1);
                                }}
                            >
                                +
                            </button>
                        </section>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer
                                components={[
                                    'MobileDateTimePicker',
                                    'MobileDateTimePicker',
                                ]}
                            >
                                <DemoItem label="開始時間">
                                    <MobileDateTimePicker
                                        value={startTime}
                                        onChange={(newDateVal) => {
                                            if (newDateVal) {
                                                setStartTime(newDateVal);
                                            }
                                        }}
                                    />
                                </DemoItem>
                                <DemoItem label="結束時間">
                                    <MobileDateTimePicker
                                        value={endTime}
                                        onChange={(newDateVal) => {
                                            if (newDateVal) {
                                                setEndTime(newDateVal);
                                            }
                                        }}
                                    />
                                </DemoItem>
                            </DemoContainer>
                        </LocalizationProvider>
                        <button
                            className="px-8 py-2 bg-emerald-600 font-bold text-white"
                            onClick={() => {
                                setSport(null);
                            }}
                        >
                            取消
                        </button>
                        <button
                            className="px-8 py-2 bg-sky-600 font-bold text-white"
                            onClick={() => {
                                createNewEvent();
                            }}
                        >
                            確認送出
                        </button>
                    </section>
                )}
            </main>
        </>
    );
}
