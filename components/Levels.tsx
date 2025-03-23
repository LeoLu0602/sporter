import { explainLevel, getSportEmoji } from '@/lib/utils';
import { useUser, useUserDispatch } from '@/context/Context';
import { ConfigProvider, Slider } from 'antd';

export default function Levels() {
    const user = useUser();
    const userDispatch = useUserDispatch();
    const levels: {
        sport: string;
        prop:
            | 'soccer_level'
            | 'basketball_level'
            | 'tennis_level'
            | 'table_tennis_level'
            | 'badminton_level';
        level: number;
    }[] = user
        ? [
              {
                  sport: 'soccer',
                  prop: 'soccer_level',
                  level: user.soccer_level,
              },
              {
                  sport: 'basketball',
                  prop: 'basketball_level',
                  level: user.basketball_level,
              },
              {
                  sport: 'tennis',
                  prop: 'tennis_level',
                  level: user.tennis_level,
              },
              {
                  sport: 'table tennis',
                  prop: 'table_tennis_level',
                  level: user.table_tennis_level,
              },
              {
                  sport: 'badminton',
                  prop: 'badminton_level',
                  level: user.badminton_level,
              },
          ]
        : [];

    return (
        <>
            {user && userDispatch && (
                <section>
                    {levels.map(({ sport, prop, level }) => (
                        <div key={sport} className="mb-8">
                            <span className="text-2xl mb-8 block">
                                {`${getSportEmoji(sport)} ${explainLevel(level)}`}
                            </span>
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: '#00aa00',
                                        controlHeight: 48,
                                    },
                                }}
                            >
                                <Slider
                                    value={user[prop]}
                                    min={0}
                                    max={6}
                                    onChange={(newVal) => {
                                        userDispatch({
                                            user: {
                                                ...user,
                                                [prop]: newVal,
                                            },
                                        });
                                    }}
                                />
                            </ConfigProvider>
                        </div>
                    ))}
                </section>
            )}
        </>
    );
}
