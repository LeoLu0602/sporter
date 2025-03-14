export default function ParticipantList({
    show,
    participants,
}: {
    show: boolean;
    participants: { id: string; username: string }[];
}) {
    if (!show || participants.length === 0) {
        return <></>;
    }

    return (
        <div className="pt-8 flex flex-wrap">
            {participants.map(({ id, username }) => (
                <div
                    key={id}
                    className="p-2 border-2 border-sky-500 text-sky-500 cursor-pointer rounded-xl"
                >
                    {username}
                </div>
            ))}
        </div>
    );
}
