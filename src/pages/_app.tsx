import type { AppProps } from 'next/app';
import '../styles/sass/index.scss';
import { useState } from 'react';
import Navigation from '@/components/Navigation';

export default function App({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState<LogInResponseForm>(null);

    if (pageProps.statusCode === 404) return <Component {...pageProps} />;

    return (
        <>
            <div className="o-app">
                <Navigation
                    hasUser={() => user}
                    setUser={(user: LogInResponseForm) => setUser(user)}
                />
                <Component
                    {...pageProps}
                    setUser={(user: LogInResponseForm) => setUser(user)}
                    hasUser={() => user}
                />
            </div>
        </>
    );
}
