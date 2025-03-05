import { Geist } from 'next/font/google';
import './globals.css';
import { Provider } from '@/context/Context';

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
            <body className="bg-background text-foreground">
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}
