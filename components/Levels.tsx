import { explainLevel } from '@/lib/utils';
import LevelBar from '@/components/LevelBar';
import { useUser, useUserDispatch } from '@/context/Context';

export default function Levels() {
    const user = useUser();
    const userDispatch = useUserDispatch();

    return (
        <>
            {user && userDispatch && (
                <section className="flex flex-col gap-16">
                    <section>
                        <span className="text-2xl">
                            ⚽ {explainLevel(user.soccer_level)}
                        </span>
                        <LevelBar
                            level={user.soccer_level}
                            chooseLevel={(i) => {
                                userDispatch({
                                    user: {
                                        ...user,
                                        soccer_level: i,
                                    },
                                });
                            }}
                        />
                    </section>
                    <section>
                        <span className="text-2xl">
                            🏀 {explainLevel(user.basketball_level)}
                        </span>
                        <LevelBar
                            level={user.basketball_level}
                            chooseLevel={(i) => {
                                userDispatch({
                                    user: {
                                        ...user,
                                        basketball_level: i,
                                    },
                                });
                            }}
                        />
                    </section>
                    <section>
                        <span className="text-2xl">
                            🎾 {explainLevel(user.tennis_level)}
                        </span>
                        <LevelBar
                            level={user.tennis_level}
                            chooseLevel={(i) => {
                                userDispatch({
                                    user: {
                                        ...user,
                                        tennis_level: i,
                                    },
                                });
                            }}
                        />
                    </section>
                    <section>
                        <span className="text-2xl">
                            🏓 {explainLevel(user.table_tennis_level)}
                        </span>
                        <LevelBar
                            level={user.table_tennis_level}
                            chooseLevel={(i) => {
                                userDispatch({
                                    user: {
                                        ...user,
                                        table_tennis_level: i,
                                    },
                                });
                            }}
                        />
                    </section>
                    <section>
                        <span className="text-2xl">
                            🏸 {explainLevel(user.badminton_level)}
                        </span>
                        <LevelBar
                            level={user.badminton_level}
                            chooseLevel={(i) => {
                                userDispatch({
                                    user: {
                                        ...user,
                                        badminton_level: i,
                                    },
                                });
                            }}
                        />
                    </section>
                </section>
            )}
        </>
    );
}
