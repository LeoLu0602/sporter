import ContinueWithGoogleBtn from '@/components/ContinueWithGoogleBtn';

export default function Welcome() {
    return (
        <>
            <main className="fixed left-0 top-0 w-full h-screen flex flex-col justify-center items-center font-bold">
                <img className="w-4/5 mb-12" src="/logo-2.png" alt="" />
                <ContinueWithGoogleBtn />
            </main>
        </>
    );
}
