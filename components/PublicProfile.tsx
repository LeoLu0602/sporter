import { explainLevel, UserType } from '@/lib/utils';

export default function PublicProfile({
    user,
    close,
}: {
    user: UserType | null;
    close: () => void;
}) {
    if (!user) {
        return <></>;
    }

    return (
        <div className="fixed left-0 top-0 w-full h-screen z-50 bg-white p-8 pb-64 text-xl text-gray-500 overflow-y-auto">
            <div className="flex gap-4 mb-8">
                <div>名稱:</div>
                <div>{user.username}</div>
            </div>

            <div className="flex gap-4 mb-8">
                <div>性別:</div>
                <div>
                    {user.gender === 1
                        ? '男'
                        : user.gender === 2
                          ? '女'
                          : '不透漏'}
                </div>
            </div>

            <div className="flex gap-4 mb-8">
                <div>足球程度:</div>
                <div>{explainLevel(user.soccer_level)}</div>
            </div>

            <div className="flex gap-4 mb-8">
                <div>籃球程度:</div>
                <div>{explainLevel(user.basketball_level)}</div>
            </div>

            <div className="flex gap-4 mb-8">
                <div>網球程度:</div>
                <div>{explainLevel(user.tennis_level)}</div>
            </div>

            <div className="flex gap-4 mb-8">
                <div>桌球程度:</div>
                <div>{explainLevel(user.table_tennis_level)}</div>
            </div>

            <div className="flex gap-4 mb-8">
                <div>羽球程度:</div>
                <div>{explainLevel(user.badminton_level)}</div>
            </div>

            <div className="mb-8">
                <div className="mb-8">自介:</div>
                <div>{user.intro}</div>
            </div>

            <div className="mt-4 flex gap-4 fixed right-8 bottom-8">
                <button
                    className="px-4 py-2 text-emerald-500 border-emerald-500 border-2 bg-white"
                    onClick={() => {
                        close();
                    }}
                >
                    返回
                </button>
                <button className="px-4 py-2 text-rose-500 border-rose-500 border-2 bg-white">
                    封鎖
                </button>
            </div>
        </div>
    );
}
