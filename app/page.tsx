import ContinueWithGoogleBtn from '@/app/ContinueWithGoogleBtn';

export default function Welcome() {
    return (
        <>
            <main className="min-h-screen bg-sky-500 flex flex-col justify-center items-center">
                <h1 className="text-6xl text-white font-bold mb-12">
                    Sportify
                </h1>
                <ContinueWithGoogleBtn />
            </main>
        </>
    );
}
