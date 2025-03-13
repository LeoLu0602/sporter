import { useUser, useUserEvents } from '@/context/Context';
import { EventType, getSportEmoji, supabase } from '@/lib/utils';
import ParticipantList from '@/components/ParticipantList';
import { useEffect, useState } from 'react';

export default function EventDetails({
    details,
    hideDetails,
}: {
    userEmail: string;
    details: EventType | null;
    hideDetails: () => void;
}) {
    const user = useUser();
    const userEvents = useUserEvents();

    if (!details || !user || !userEvents) {
        return <></>;
    }

    const [showParticipantList, setShowParticipantList] =
        useState<boolean>(false);
    const [participants, setParticipants] = useState<
        { id: string; email: string; username: string }[]
    >([]);
    const [owner, setOwner] = useState<{
        id: string;
        email: string;
        username: string;
    } | null>(null);
    const isOwner = user.email === details.email;
    const isParticipant = new Set(userEvents.map(({ id }) => id)).has(
        details.id
    );

    useEffect(() => {
        async function getParticipants() {
            if (!details) {
                return;
            }

            const { data, error } = await supabase
                .from('participant')
                .select('*')
                .eq('event_id', details.id);

            if (error) {
                alert('Error!');
                console.error(error);

                return;
            }

            const { data: data2, error: error2 } = await supabase
                .from('user')
                .select('*')
                .in(
                    'id',
                    data.map(({ user_id }) => user_id)
                );

            if (error2) {
                alert('Error!');
                console.error(error2);

                return;
            }

            setParticipants(
                data2.map(({ id, email, username }) => {
                    return { id, email, username };
                })
            );
        }

        async function getOwnerUserName() {
            if (!details) {
                return;
            }

            const { data, error } = await supabase
                .from('user')
                .select('*')
                .eq('email', details.email);

            if (error) {
                alert('Error!');
                console.error(error);

                return;
            }

            setOwner(data[0]);
        }

        getParticipants();
        getOwnerUserName();
    }, [details]);

    async function joinEvent() {
        if (!user || !details) {
            return;
        }

        const { data, error: error1 } = await supabase
            .from('participant')
            .select('*')
            .eq('user_id', user.id)
            .eq('event_id', details.id);

        if (error1) {
            alert('Error!');
            console.error(error1);

            return;
        }

        if (data.length > 0) {
            return;
        }

        const { error: error2 } = await supabase
            .from('participant')
            .insert([{ user_id: user.id, event_id: details.id }]);

        if (error2) {
            alert('Error!');
            console.error(error2);

            return;
        }

        const { error: error3 } = await supabase.rpc(
            'increment_remaining_spots',
            {
                event_id: details.id,
                x: -1,
            }
        );

        if (error3) {
            alert('Error!');
            console.error(error3);

            return;
        }

        window.location.replace('/event');
    }

    async function leaveEvent() {
        const areYouSure = confirm('確定退出？');

        if (!areYouSure || !user || !details) {
            return;
        }

        const { error: error1 } = await supabase
            .from('participant')
            .delete()
            .eq('user_id', user.id)
            .eq('event_id', details.id);

        if (error1) {
            alert('Error!');
            console.error(error1);

            return;
        }

        const { error: error2 } = await supabase.rpc(
            'increment_remaining_spots',
            {
                event_id: details.id,
                x: 1,
            }
        );

        if (error2) {
            alert('Error!');
            console.error(error2);

            return;
        }

        window.location.reload();
    }

    async function deleteEvent() {
        const areYouSure = confirm('確定刪除？');

        if (!areYouSure || !details) {
            return;
        }

        const { error } = await supabase
            .from('event')
            .delete()
            .eq('id', details.id);

        if (error) {
            alert('Error!');
            console.error(error);

            return;
        }

        window.location.reload();
    }

    function toggleParticipantList() {
        setShowParticipantList((oldVal) => !oldVal);
    }

    return (
        <div className="fixed left-0 top-0 z-50 h-screen w-full bg-white p-8 text-xl overflow-auto">
            <div className="flex flex-col gap-8">
                <div className="flex gap-4 text-2xl">
                    <div>{getSportEmoji(details.sport)}</div>
                    <div className="flex-grow overflow-hidden whitespace-nowrap text-ellipsis">
                        {details.title}
                    </div>
                </div>
                <div className="flex gap-4 whitespace-nowrap">
                    <div>地點:</div>
                    <div className="flex-grow overflow-hidden text-ellipsis">
                        {details.location}
                    </div>
                </div>
                <a
                    className="text-blue-500"
                    href={`https://www.google.com/maps?q=${details.lat},${details.lng}`}
                    target="_blank"
                >
                    開啟地圖
                </a>
                <div>
                    <span className="mr-4">開始時間:</span>
                    {new Date(details.start_time).toLocaleString('en-US', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                        hourCycle: 'h23',
                    })}
                </div>
                <div>
                    <span className="mr-4">結束時間:</span>
                    {new Date(details.end_time).toLocaleString('en-US', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                        hourCycle: 'h23',
                    })}
                </div>
                <div className="flex gap-4">
                    <span className="whitespace-nowrap">發起人:</span>
                    <span className="flex-grow whitespace-nowrap text-ellipsis overflow-hidden">
                        {owner ? owner.username : '載入中...'}
                    </span>
                </div>
                <div>
                    <span className="mr-4">目前人數 (不含發起人):</span>
                    {details.participant_limit - details.remaining_spots} /{' '}
                    {details.participant_limit}
                </div>
                <div>
                    <button
                        className="border-orange-500 border-2 text-orange-500 px-4 py-2"
                        onClick={() => {
                            toggleParticipantList();
                        }}
                    >
                        {showParticipantList ? '關閉名單' : '檢視名單'}
                    </button>
                    {showParticipantList && (
                        <ParticipantList participants={participants} />
                    )}
                </div>
            </div>
            <div className="flex gap-4 mt-8">
                <button
                    className="px-4 py-2 text-emerald-500 border-emerald-500 border-2"
                    onClick={hideDetails}
                >
                    返回
                </button>
                {!isParticipant && (
                    <button
                        className="px-4 py-2 border-sky-500 border-2 text-sky-500"
                        onClick={() => {
                            joinEvent();
                        }}
                    >
                        +1
                    </button>
                )}
                {isParticipant && !isOwner && (
                    <button
                        className="px-4 py-2 border-rose-500 border-2 text-rose-500"
                        onClick={() => {
                            leaveEvent();
                        }}
                    >
                        &minus; 1
                    </button>
                )}
                {isOwner && (
                    <button
                        className="px-4 py-2 border-rose-500 border-2 text-rose-500"
                        onClick={() => {
                            deleteEvent();
                        }}
                    >
                        刪除
                    </button>
                )}
            </div>
        </div>
    );
}
