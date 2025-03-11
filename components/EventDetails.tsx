import { EventType, getSportEmoji } from '@/lib/utils';

export default function EventDetails({
    details,
    hideDetails,
    join,
}: {
    details: EventType | null;
    hideDetails: () => void;
    join: () => void;
}) {
    return (
        <div className="fixed left-0 top-0 z-50 h-screen w-full bg-[#f2f4f7] p-4">
            <div className="flex flex-col gap-8">
                <div className="flex gap-4 text-2xl font-bold">
                    <div>{getSportEmoji(details!.sport!)}</div>
                    <div>{details!.title}</div>
                </div>
                <div>
                    <span className="mr-4">地點:</span>
                    {details!.location}
                    <a
                        className="ml-4 text-blue-500 font-bold"
                        href={`https://www.google.com/maps?q=${details!.lat},${details!.lng}`}
                        target="_blank"
                    >
                        地圖
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
                    {details!.participant_limit - details!.remaining_spots}/
                    {details!.participant_limit}
                </div>
            </div>
            <div className="flex gap-8">
                <button
                    className="mt-8 border-2 border-black px-4 py-2 rounded-xl bg-[#f2f4f7]"
                    onClick={hideDetails}
                >
                    返回
                </button>
                <button
                    className="mt-8 border-2 border-black px-4 py-2 rounded-xl bg-[#f2f4f7]"
                    onClick={join}
                >
                    +1
                </button>
            </div>
        </div>
    );
}
