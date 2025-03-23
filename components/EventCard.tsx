import { getSportEmoji } from '@/lib/utils';
import clsx from 'clsx';
import { MouseEventHandler } from 'react';

export default function EventCard({
    isOwner = false,
    sport,
    title,
    startTime,
    endTime,
    location,
    openCard,
}: {
    isOwner: boolean;
    sport: string;
    title: string;
    startTime: Date;
    endTime: Date;
    location: string;
    openCard: MouseEventHandler<HTMLDivElement>;
}) {
    return (
        <div
            className={clsx(
                'cursor-pointer p-4 text-lg border-b-[1px] border-gray-200',
                { 'bg-gray-100': isOwner }
            )}
            onClick={openCard}
        >
            <div className="flex flex-col gap-4 overflow-hidden">
                <div className="text-xl flex gap-4 w-full">
                    <div>{getSportEmoji(sport)}</div>
                    <div className="flex-grow text-ellipsis whitespace-nowrap overflow-hidden">
                        {title}
                    </div>
                </div>
                <div className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis text-gray-500 text-base">
                    {location}
                </div>
                <div className="text-base text-gray-500">
                    <div>
                        <span className="mr-4">開始時間:</span>
                        {new Date(startTime).toLocaleString('en-US', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                            hourCycle: 'h23',
                        })}
                    </div>
                    <div>
                        <span className="mr-4">結束時間:</span>
                        {new Date(endTime).toLocaleString('en-US', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                            hourCycle: 'h23',
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
