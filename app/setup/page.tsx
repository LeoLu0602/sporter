import Link from 'next/link';

export default function SetUp() {
    return (
        <>
            <main className="z-50 fixed left-0 top-0 w-full h-screen flex flex-col justify-center items-center text-2xl">
                <h1 className="font-bold mb-8">設定提醒</h1>
                <p className="mb-8 px-8">
                    Sporter 使用您的設定配對運動，設定<b>距離偏好</b>、
                    <b>運動程度</b>以獲得最佳使用者體驗
                </p>
                <Link className="text-sky-500" href="/profile">
                    前往設定
                </Link>
            </main>
        </>
    );
}
