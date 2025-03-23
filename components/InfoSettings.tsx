import { useUser, useUserDispatch } from '@/context/Context';
import { Slider, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { ChangeEvent } from 'react';

export default function InfoSettings() {
    const user = useUser();
    const userDispatch = useUserDispatch();

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

    return (
        <>
            {user && userDispatch && (
                <>
                    <section className="mb-8">
                        <span className="mr-4 outline-none decoration-transparent">
                            Email:
                        </span>
                        <span className="no-underline">
                            <input
                                className="w-60 overflow-hidden text-ellipsis text-black"
                                type="text"
                                disabled={true}
                                value={user.email}
                            />
                        </span>
                    </section>

                    <section className="mb-8">
                        <label className="w-full focus:outline-none mr-4">
                            名稱:
                        </label>
                        <input
                            className="w-60 overflow-hidden text-ellipsis"
                            type="text"
                            name="name"
                            value={user.username}
                            onChange={handleInfoChange}
                        />
                    </section>

                    <section className="flex gap-4 mb-8">
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

                    <section className="mb-8">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    label="生日"
                                    value={dayjs(user.birthday)}
                                    onChange={(newDateVal) => {
                                        if (newDateVal) {
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

                    <section className="mb-8">
                        <div className="mb-8">
                            <span className="mr-4">距離偏好:</span>
                            <span>
                                {user.distance >= 1000
                                    ? Math.floor(
                                          user.distance / 1000
                                      ).toString() +
                                      ',' +
                                      (user.distance % 1000)
                                          .toString()
                                          .padStart(3, '0')
                                    : user.distance.toString()}{' '}
                                公尺
                            </span>
                        </div>
                        <input
                            className="range range-success range-sm w-full"
                            type="range"
                            min={500}
                            max={10000}
                            step={500}
                            value={user.distance}
                            onChange={(e) => {
                                userDispatch({
                                    user: {
                                        ...user,
                                        distance: parseInt(e.target.value),
                                    },
                                });
                            }}
                        />
                    </section>

                    <section className="mb-8">
                        <label className="block mb-4">
                            自介 ({user.intro.length}/50){' '}
                        </label>
                        <TextField
                            className="w-full"
                            name="intro"
                            multiline
                            minRows={3}
                            maxRows={3}
                            value={user.intro}
                            onChange={handleInfoChange}
                        />
                    </section>
                </>
            )}
        </>
    );
}
