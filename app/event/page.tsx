import Map from '@/components/MapContainer';

export default function Event() {
    return (
        <>
            <header>
                <h1 className="text-center p-8 text-2xl font-bold">我的運動</h1>
            </header>
            <nav>
                <ul className="flex justify-around">
                    <li>配對中</li>
                    <li>已配對</li>
                    <li>歷史記錄</li>
                </ul>
            </nav>
            <main>
                <Map />
            </main>
        </>
    );
}
