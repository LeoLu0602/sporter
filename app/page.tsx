import ContinueWithGoogleBtn from '@/components/ContinueWithGoogleBtn';

export default function Welcome() {
    return (
        <>
            <main className="fixed left-0 top-0 w-full h-screen flex flex-col justify-center items-center font-bold">
                <img
                    className="w-40 h-40 mb-12"
                    src="/logo.png"
                    alt="Sporter Logo"
                />
                <h1 className="text-5xl mb-12 text-[#499c2c]">Sporter</h1>
                <ContinueWithGoogleBtn />
            </main>
        </>
    );
}
