import { getSportEmoji } from '@/lib/utils';
import { MouseEventHandler } from 'react';

export default function EventCard({
    sport,
    title,
    time,
    length,
    location,
    openCard,
}: {
    sport: string;
    title: string;
    length: number;
    time: Date;
    location: string;
    openCard: MouseEventHandler<HTMLDivElement>;
}) {
    return (
        <div
            className="border-2 border-black cursor-pointer p-4 rounded-xl text-lg flex items-center gap-4"
            onClick={openCard}
        >
            <div className="text-2xl">{getSportEmoji(sport)}</div>
            <div>
                <div>{title}</div>
                <div>📍 {location}</div>
                <div>
                    📅{' '}
                    {new Date(time).toLocaleString('zh-TW', {
                        dateStyle: 'full',
                    })}
                </div>
                <div>
                    🕙{' '}
                    {new Date(time).toLocaleString('en-US', {
                        timeStyle: 'short',
                    })} ({length} hr)
                </div>
            </div>
        </div>
    );
}
