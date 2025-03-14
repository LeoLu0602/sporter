'use client';

import { ChangeEvent, useState } from 'react';
import {
    supabase,
    getSportEmoji,
    explainLevel,
    calculateAge,
    getSportChinese,
} from '@/lib/utils';
import Slider from '@mui/material/Slider';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import MapContainer from '@/components/MapContainer';
import { useUser } from '@/context/Context';
import { Box, FormControl, FormLabel, TextField } from '@mui/material';

export default function New() {
    const user = useUser();
    const [sport, setSport] = useState<string | null>(null);
    const [ages, setAges] = useState<number[]>([0, 100]);
    const [levels, setLevels] = useState<number[]>([1, 6]);
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
        message: string;
    }>({
        sport: null,
        title: '',
        gender: 3,
        ageMin: 0,
        ageMax: 100,
        levelMin: 1,
        levelMax: 6,
        lat: null,
        lng: null,
        location: '',
        participantLimit: 1,
        message: '',
    });
    const [startTime, setStartTime] = useState<Dayjs>(dayjs().startOf('day'));
    const [endTime, setEndTime] = useState<Dayjs>(dayjs().startOf('day'));
    const [showMap, setShowMap] = useState<boolean>(false);
    const radomNumber = Math.floor(Math.random() * 999 + 1);

    function selectSport(sport: string) {
        if (!user) {
            return;
        }

        const age: number = user.birthday ? calculateAge(user.birthday) : 20;
        const level: number =
            sport === 'soccer'
                ? user.soccer_level
                : sport === 'basketball'
                  ? user.basketball_level
                  : sport === 'tennis'
                    ? user.tennis_level
                    : sport === 'table tennis'
                      ? user.table_tennis_level
                      : user.badminton_level;
        const initStartTime = new Date(
            Math.ceil(Date.now() / (1000 * 60 * 5)) * (1000 * 60 * 5)
        );
        const initEndTime = new Date(initStartTime.getTime() + 1000 * 60 * 60);

        setSport(sport);
        setStartTime(dayjs(initStartTime));
        setEndTime(dayjs(initEndTime));
        setEventInfo({
            sport,
            title:
                getSportChinese(sport) +
                ' ' +
                radomNumber.toString().padStart(3, '0'),
            gender: user.gender,
            ageMin: Math.max(0, age - 5),
            ageMax: Math.min(100, age + 5),
            levelMin: Math.max(1, level),
            levelMax: Math.max(1, level),
            lat: null,
            lng: null,
            location: '',
            participantLimit: 1,
            message: '',
        });
        setAges([Math.max(0, age - 5), Math.min(100, age + 5)]);
        setLevels([level, level]);
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
            case 'message':
                setEventInfo((oldVal) => {
                    if (
                        e.target.value.length <= 50 &&
                        e.target.value.length >= 0
                    ) {
                        return { ...oldVal, message: e.target.value };
                    }

                    return oldVal;
                });
                break;
        }
    }

    async function createNewEvent() {
        if (
            !user ||
            !eventInfo.lat ||
            !eventInfo.lng ||
            eventInfo.location === ''
        ) {
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
            message,
        } = eventInfo;

        const { error } = await supabase.from('event').insert([
            {
                email: user.email,
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
                message,
            },
        ]);

        if (error) {
            alert('Error!');
            console.error(error);

            return;
        }

        window.location.replace('/events');
    }

    function openMap() {
        setShowMap(true);
    }

    function closeMap() {
        setShowMap(false);
    }

    if (!user) {
        return <></>;
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
                                setEventInfo((oldVal) => {
                                    return { ...oldVal, lat, lng };
                                });
                            }}
                            closeMap={closeMap}
                        />
                    </div>
                )}
                {sport === null && (
                    <section className="flex flex-wrap justify-between gap-8 px-2 mb-24">
                        {[
                            'soccer',
                            'basketball',
                            'tennis',
                            'table tennis',
                            'badminton',
                        ].map((sport) => (
                            <button
                                className="w-40 h-40 rounded-xl cursor-pointer border-2 border-[#bbb] flex justify-center items-center text-6xl"
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
                        <section className="flex gap-4 items-center">
                            <h2 className="text-2xl">{getSportEmoji(sport)}</h2>
                            <Box
                                component="form"
                                sx={{ input: { fontSize: '1.5rem' } }}
                                noValidate
                                autoComplete="off"
                            >
                                <TextField
                                    label=""
                                    name="title"
                                    variant="standard"
                                    value={eventInfo.title}
                                    onChange={handleEventInfoChange}
                                />
                            </Box>
                        </section>
                        <section className="w-full flex flex-col gap-4">
                            <h2>
                                <span className="mr-4">對手程度:</span>
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
                            <h2>對手性別:</h2>
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
                                <span className="mr-4">對手年紀:</span>
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
                            <button
                                className="text-emerald-500 border-2 border-emerald-500 px-4 py-2 mr-4"
                                onClick={() => {
                                    openMap();
                                }}
                            >
                                開啟地圖
                            </button>

                            {eventInfo.lat && eventInfo.lng ? (
                                <a
                                    className="text-sky-500"
                                    href={`https://www.google.com/maps?q=${eventInfo.lat},${eventInfo.lng}`}
                                    target="_blank"
                                >
                                    地點
                                </a>
                            ) : (
                                <span>尚未選擇地點</span>
                            )}
                        </section>
                        <section>
                            <label className="block mb-4">地點名稱:</label>
                            <TextField
                                className="border-2 border-[#bbb] focus:outline-none p-2 w-full"
                                name="location"
                                value={eventInfo.location}
                                onChange={handleEventInfoChange}
                            />
                        </section>
                        <section className="flex items-center gap-4">
                            <h2 className="mr-4">需求人數:</h2>
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
                                        ampm={false}
                                        minutesStep={5}
                                        onChange={(newDateVal) => {
                                            if (newDateVal) {
                                                // Make sure endTime always >= startTime.
                                                if (newDateVal > endTime) {
                                                    setEndTime(newDateVal);
                                                }

                                                setStartTime(newDateVal);
                                            }
                                        }}
                                    />
                                </DemoItem>
                                <DemoItem label="結束時間">
                                    <MobileDateTimePicker
                                        value={endTime}
                                        ampm={false}
                                        minutesStep={5}
                                        onChange={(newDateVal) => {
                                            if (newDateVal) {
                                                // Make sure endTime always >= startTime.
                                                if (newDateVal < startTime) {
                                                    setStartTime(newDateVal);
                                                }

                                                setEndTime(newDateVal);
                                            }
                                        }}
                                    />
                                </DemoItem>
                            </DemoContainer>
                        </LocalizationProvider>
                        <FormControl>
                            <FormLabel className="mb-4">
                                備註 ({eventInfo.message.length}
                                /50)
                            </FormLabel>
                            <TextField
                                name="message"
                                minRows={3}
                                multiline
                                value={eventInfo.message}
                                onChange={handleEventInfoChange}
                            />
                        </FormControl>

                        <button
                            className="px-8 py-2 border-emerald-500 border-2 text-emerald-500"
                            onClick={() => {
                                setSport(null);
                            }}
                        >
                            取消
                        </button>
                        <button
                            className="px-8 py-2 border-sky-500 border-2 text-sky-500"
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
