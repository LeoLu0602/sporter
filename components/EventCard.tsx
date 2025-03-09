import { getSportEmoji } from '@/lib/utils';

export default function EventCard({
    sport,
    title,
    time,
    location,
}: {
    sport: string;
    title: string;
    time: Date;
    location: string;
}) {
    return (
        <div className="border-2 border-black cursor-pointer p-4 rounded-xl text-lg flex items-center gap-4">
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
                    })}
                </div>
            </div>
        </div>
    );
}
