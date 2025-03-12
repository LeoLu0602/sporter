import { EventType, getSportEmoji } from '@/lib/utils';

export default function EventDetails({
    details,
    hideDetails,
    join,
    leave,
}: {
    details: EventType | null;
    hideDetails: () => void;
    join: (() => void) | null;
    leave: (() => void) | null;
}) {
    return (
        <div className="fixed left-0 top-0 z-50 h-screen w-full bg-white p-8">
            <div className="flex flex-col gap-8">
                <div className="flex gap-4 text-2xl">
                    <div>{getSportEmoji(details!.sport!)}</div>
                    <div>{details!.title}</div>
                </div>
                <div>
                    <span className="mr-4">地點:</span>
                    {details!.location}
                    <a
                        className="ml-4 text-blue-500"
                        href={`https://www.google.com/maps?q=${details!.lat},${details!.lng}`}
                        target="_blank"
                    >
                        開啟地圖
                    </a>
                </div>
                <div>
                    <span className="mr-4">開始時間:</span>
                    {new Date(details!.start_time!).toLocaleString('en-US', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                    })}
                </div>
                <div>
                    <span className="mr-4">結束時間:</span>
                    {new Date(details!.end_time!).toLocaleString('en-US', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                    })}
                </div>
                <div>
                    <span className="mr-4">目前人數 (不含發起人):</span>
                    {details!.participant_limit -
                        details!.remaining_spots} / {details!.participant_limit}
                </div>
                <div>
                    <button className="border-emerald-500 border-2 text-emerald-500 px-4 py-2">
                        檢視名單
                    </button>
                </div>
            </div>
            <div className="flex gap-4 mt-8">
                <button
                    className="px-4 py-2 text-emerald-500 border-emerald-500 border-2"
                    onClick={hideDetails}
                >
                    返回
                </button>
                {join && (
                    <button
                        className="px-4 py-2 border-sky-500 border-2 text-sky-500"
                        onClick={join}
                    >
                        +1
                    </button>
                )}
                {leave && (
                    <button
                        className="px-4 py-2 border-rose-500 border-2 font-bold text-rose-500"
                        onClick={leave}
                    >
                        &minus; 1
                    </button>
                )}
            </div>
        </div>
    );
}
