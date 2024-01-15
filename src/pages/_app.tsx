import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/sass/index.scss';
import { UserProvider } from '@/context/UserContext';
import { Roboto } from 'next/font/google';

const fontConfig = Roboto({ weight: '400', subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
    if (pageProps.statusCode === 404) return <Component {...pageProps} />;
    return (
        <>
            <div className={`o-app ${fontConfig.className}`}>
                <Head>
                    <link rel="icon" href="data:,"></link>
                </Head>
                <UserProvider>
                    <Component {...pageProps} />
                </UserProvider>
            </div>
        </>
    );
}
