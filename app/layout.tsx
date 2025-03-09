import { Geist } from 'next/font/google';
import './globals.css';
import { Provider } from '@/context/Context';
import Navbar from '@/components/Navbar';

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: 'Sportify',
    description: '',
};

const geistSans = Geist({
    display: 'swap',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={geistSans.className}
            suppressHydrationWarning
        >
            <body className="bg-background text-foreground bg-[#f2f4f7] font-sans">
                <Provider>
                    {children}
                    <Navbar />
                </Provider>
            </body>
        </html>
    );
}
