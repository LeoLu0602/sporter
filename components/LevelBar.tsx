import Level from '@/components/Level';

export default function LevelBar({
    level,
    chooseLevel,
}: {
    level: number;
    chooseLevel: (i: number) => void;
}) {
    return (
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
    );
}
