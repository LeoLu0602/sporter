import ContinueWithGoogleBtn from '@/app/ContinueWithGoogleBtn';

export default function Welcome() {
    return (
        <>
            <main className="min-h-screen flex flex-col justify-center items-center">
                <h1 className="text-5xl mb-12">
                    Sportify
                </h1>
                <ContinueWithGoogleBtn />
            </main>
        </>
    );
}
