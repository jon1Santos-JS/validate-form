import type { AppProps } from 'next/app';
import '../styles/sass/index.scss';
import NavigationBar from '@/components/Navigation';

export default function App({ Component, pageProps }: AppProps) {
    if (pageProps.statusCode === 404) return <Component {...pageProps} />;

    return (
        <>
            <div className="o-app">
                <NavigationBar />
                <Component {...pageProps} />
            </div>
        </>
    );
}
