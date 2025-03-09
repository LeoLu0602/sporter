import { getSportEmoji } from '@/lib/utils';
import { MouseEventHandler } from 'react';

export default function EventCard({
    sport,
    title,
    startTime,
    endTime,
    location,
    openCard,
}: {
    sport: string;
    title: string;
    startTime: Date;
    endTime: Date;
    location: string;
    openCard: MouseEventHandler<HTMLDivElement>;
}) {
    return (
        <div
            className="border-2 border-black cursor-pointer p-4 rounded-xl text-lg flex items-center gap-4"
            onClick={openCard}
        >
            <div className="flex flex-col gap-4">
                <div className="text-2xl font-bold">
                    {getSportEmoji(sport)} {title}
                </div>
                <div>
                    <span className="mr-4">地點:</span>
                    {location}
                </div>
                <div>
                    {new Date(startTime).toLocaleString('en-US', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                    })}
                    {' ~ '}
                    {new Date(endTime).toLocaleString('en-US', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                    })}
                </div>
            </div>
        </div>
    );
}
