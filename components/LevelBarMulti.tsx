import LevelMulti from '@/components/LevelMulti';

export default function LevelBarMulti({
    levels,
    chooseLevel,
}: {
    levels: Set<number>;
    chooseLevel: (i: number) => void;
}) {
    return (
        <section className="relative">
            <span className="absolute left-0 top-[38px] w-full h-1 bg-black" />
            <section className="w-full flex justify-between items-center py-8 relative z-10">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <LevelMulti
                        key={i}
                        index={i}
                        levels={levels}
                        handleClick={() => {
                            chooseLevel(i);
                        }}
                    />
                ))}
            </section>
        </section>
    );
}
