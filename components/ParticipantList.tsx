import { UserType } from '@/lib/utils';

export default function ParticipantList({
    show,
    participants,
    seeUserProfile,
}: {
    show: boolean;
    participants: UserType[];
    seeUserProfile: (user: UserType) => void;
}) {
    if (!show || participants.length === 0) {
        return <></>;
    }

    return (
        <div className="pt-8 flex flex-wrap">
            {participants.map((participant) => (
                <button
                    key={participant.id}
                    className="p-2 border-2 border-sky-500 text-sky-500 cursor-pointer rounded-xl"
                    onClick={() => {
                        seeUserProfile(participant);
                    }}
                >
                    {participant.username}
                </button>
            ))}
        </div>
    );
}
