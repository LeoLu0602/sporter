'use client';

import { ChangeEvent, useState } from 'react';
import {
    supabase,
    getSportEmoji,
    explainLevel,
    getSportChinese,
    calculateAge,
} from '@/lib/utils';
import { Slider } from 'antd';
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
    const [ages, setAges] = useState<number[]>([10, 80]);
    const [levels, setLevels] = useState<number[]>([1, 6]);
    const [eventInfo, setEventInfo] = useState<{
        sport: string | null;
        title: string;
        gender: number; // 1: male, 2: female, 3: any
        lat: number | null;
        lng: number | null;
        location: string;
        participantLimit: number;
        message: string;
    }>({
        sport: null,
        title: '',
        gender: 3,
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
        const userAge = user.birthday ? calculateAge(user.birthday) : 20;

        setSport(sport);
        setStartTime(dayjs(initStartTime));
        setEndTime(dayjs(initEndTime));
        setAges([Math.max(0, userAge - 5), Math.min(100, userAge + 5)]);
        setLevels([Math.max(1, level - 1), Math.min(6, level + 1)]);
        setEventInfo({
            sport,
            title:
                getSportChinese(sport) +
                ' ' +
                radomNumber.toString().padStart(3, '0'),
            gender: user.gender,
            lat: null,
            lng: null,
            location: '',
            participantLimit: 1,
            message: '',
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
                age_min: ages[0],
                age_max: ages[1],
                level_min: levels[0],
                level_max: levels[1],
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

    return (
        <>
            <header>
                <h1 className="text-center py-4 text-2xl border-b-[1px] border-gray-200">
                    揪運動
                </h1>
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
                            closeMap={() => {
                                setShowMap(false);
                            }}
                        />
                    </div>
                )}

                {sport === null ? (
                    <section className="pb-12">
                        {[
                            'soccer',
                            'basketball',
                            'tennis',
                            'table tennis',
                            'badminton',
                        ].map((sport) => (
                            <button
                                className="py-8 w-full cursor-pointer border-b-[1px] border-gray-200 text-4xl"
                                key={sport}
                                onClick={() => {
                                    selectSport(sport);
                                }}
                            >
                                {getSportEmoji(sport)} {getSportChinese(sport)}
                            </button>
                        ))}
                    </section>
                ) : (
                    <section className="flex flex-col gap-8 text-lg pt-8 pb-20">
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
                                {explainLevel(levels[0]) +
                                    ' 到 ' +
                                    explainLevel(levels[1])}
                            </h2>
                            <div className="px-4">
                                <Slider
                                    range
                                    value={levels}
                                    min={1}
                                    max={6}
                                    onChange={(newVal) => {
                                        setLevels(newVal);
                                    }}
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
                                    range
                                    value={ages}
                                    min={0}
                                    max={100}
                                    onChange={(newVal) => {
                                        setAges(newVal);
                                    }}
                                />
                            </div>
                        </section>

                        <section>
                            <button
                                className="text-emerald-500 border-2 border-emerald-500 px-4 py-2 mr-4"
                                onClick={() => {
                                    setShowMap(true);
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
                                multiline
                                minRows={3}
                                maxRows={3}
                                value={eventInfo.message}
                                onChange={handleEventInfoChange}
                            />
                        </FormControl>

                        <div className="flex flex-col items-center">
                            <button
                                className="text-emerald-500 border-emerald-500 border-2 py-2 w-80 mb-8"
                                onClick={() => {
                                    setSport(null);
                                }}
                            >
                                取消
                            </button>
                            <button
                                className="px-8 py-2 w-80 border-sky-500 border-2 text-sky-500"
                                onClick={() => {
                                    createNewEvent();
                                }}
                            >
                                確認送出
                            </button>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
}
