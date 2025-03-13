import ContinueWithGoogleBtn from '@/app/ContinueWithGoogleBtn';

export default function Welcome() {
    return (
        <>
            <main className="fixed left-0 top-0 w-full h-screen flex flex-col justify-center items-center from-sky-500 bg-gradient-to-t text-white font-bold">
                <h1 className="text-5xl mb-12">Sportify</h1>
                <ContinueWithGoogleBtn />
            </main>
        </>
    );
}
