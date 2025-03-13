import Link from 'next/link';

export default function ParticipantList({
    participants,
}: {
    participants: { id: string; email: string; username: string }[];
}) {
    return (
        <div className="py-8 flex flex-wrap">
            {participants.map(({ id, email, username }) => (
                <Link
                    key={id}
                    className="p-2 border-2 border-sky-500 text-sky-500 cursor-pointer rounded-xl"
                    href={`/user/${id}`}
                    target="_blank"
                >
                    {username}
                </Link>
            ))}
        </div>
    );
}
