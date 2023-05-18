import type { AppProps } from 'next/app';
import '../styles/sass/index.scss';
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';

export default function App({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setUser(await hasUser());
        }
        fetchData();
    }, []);

    if (pageProps.statusCode === 404) return <Component {...pageProps} />;

    return (
        <>
            <div className="o-app">
                <Navigation
                    hasUser={() => user}
                    setUser={(user: boolean) => setUser(user)}
                />
                <Component
                    hasUser={() => user}
                    setUser={(user: boolean) => setUser(user)}
                    {...pageProps}
                />
            </div>
        </>
    );
}

async function hasUser() {
    const response = await fetch(
        process.env.NEXT_PUBLIC_SIGN_IN_LINK as string,
        { method: 'GET' },
    );
    const parsedResponse: LogInResponseForm = await response.json();
    return parsedResponse.user;
}
