import Level from './Level';

export default function LevelBar({
    sport,
    level,
    chooseLevel,
}: {
    sport: string;
    level: number;
    chooseLevel: (i: number) => void;
}) {
    function explainLevel(level: number): string {
        switch (level) {
            case 0:
                return '新手';
            case 1:
                return '休閒';
            case 2:
                return '中階';
            case 3:
                return '進階';
            case 4:
                return '半職業';
            case 5:
                return '職業';
        }

        return '';
    }

    return (
        <section>
            <h2 className="text-2xl">
                {sport} {explainLevel(level)}
            </h2>
            <section className="relative">
                <span className="absolute left-0 top-[38px] w-full h-1 bg-black" />
                <section className="w-full flex justify-between items-center py-8 relative z-10">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <Level
                            key={i}
                            index={i}
                            level={level}
                            handleClick={() => {
                                chooseLevel(i);
                            }}
                        />
                    ))}
                </section>
            </section>
        </section>
    );
}
