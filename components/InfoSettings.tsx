import { useUser, useUserDispatch } from '@/context/Context';
import { ConfigProvider, Slider } from 'antd';
import { Box, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { ChangeEvent, useRef } from 'react';

export default function InfoSettings() {
    const user = useUser();
    const userDispatch = useUserDispatch();
    const fileRef = useRef<HTMLInputElement>(null);

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
                    <section className="mb-8 flex justify-center">
                        <img
                            className="w-40 h-40 rounded-full cursor-pointer object-cover"
                            src={user.img ? user.img : '/person-circle.svg'}
                            alt=""
                            onClick={(e) => {
                                if (fileRef.current) {
                                    fileRef.current.click();
                                }
                            }}
                        />
                        <input
                            ref={fileRef}
                            className="hidden"
                            type="file"
                            onChange={(e) => {
                                if (e.target.files) {
                                    const file = e.target.files[0];

                                    if (file) {
                                        userDispatch({
                                            user: {
                                                ...user,
                                                img: URL.createObjectURL(file),
                                            },
                                        });
                                    }
                                }
                            }}
                        />
                    </section>

                    <section className="mb-8">
                        <span className="mr-4 outline-none decoration-transparent">
                            Email:
                        </span>
                        <input
                            className="w-60 overflow-hidden text-ellipsis text-black"
                            type="text"
                            disabled={true}
                            value={user.email}
                        />
                    </section>

                    <section className="mb-8 flex gap-4">
                        <label className="focus:outline-none">名稱:</label>
                        <Box
                            component="form"
                            sx={{ input: { fontSize: '1.125em' } }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                className="w-60"
                                name="name"
                                variant="standard"
                                value={user.username}
                                onChange={handleInfoChange}
                            />
                        </Box>
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
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: '#00aa00',
                                    controlHeight: 48,
                                },
                            }}
                        >
                            <Slider
                                range={false}
                                min={0}
                                max={10000}
                                step={100}
                                value={user.distance}
                                onChange={(newVal) => {
                                    userDispatch({
                                        user: {
                                            ...user,
                                            distance: newVal,
                                        },
                                    });
                                }}
                            />
                        </ConfigProvider>
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
