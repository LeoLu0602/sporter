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
        <div>
            {participants.map((participant) => (
                <button
                    key={participant.id}
                    className="cursor-pointer text-sky-500 mt-8"
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
