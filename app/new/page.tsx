export default function New() {
    return (
        <main className="p-4 min-h-screen">
            <h1 className="text-center pb-4 border-b-black border-b-2 text-2xl font-bold">
                揪運動
            </h1>
            <section className="flex flex-wrap justify-between gap-4 mt-4">
                <button className="w-36 h-36 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl">
                    ⚽
                </button>
                <button className="w-36 h-36 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl">
                    🏀
                </button>
                <button className="w-36 h-36 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl">
                    🎾
                </button>
                <button className="w-36 h-36 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl">
                    🏓
                </button>
                <button className="w-36 h-36 rounded-xl cursor-pointer flex justify-center items-center border-black border-4 bg-white text-8xl">
                    🏸
                </button>
            </section>
        </main>
    );
}
