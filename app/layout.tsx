import './globals.css';
import { Provider } from '@/context/Context';
import Navbar from '@/components/Navbar';
import { Noto_Sans_TC } from 'next/font/google';

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: 'Sporter',
    description: '',
};

const notoSansTC = Noto_Sans_TC({
    subsets: ['latin'],
    weight: ['400', '700'], // Adjust weights as needed
    display: 'swap',
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            translate="no"
            className={notoSansTC.className}
            suppressHydrationWarning
        >
            <body className="bg-background text-foreground bg-white">
                <Provider>
                    {children}
                    <Navbar />
                </Provider>
            </body>
        </html>
    );
}
