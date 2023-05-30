import type { AppProps } from 'next/app';
import '../styles/sass/index.scss';
import { useCallback, useEffect, useState } from 'react';
import MainNavigationBar from '@/components/MainNavigationBar';

export default function App({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState<boolean | string>('');

    const fetchData = useCallback(async () => {
        const action = process.env.NEXT_PUBLIC_SIGN_IN_LINK as string;
        const response = await fetch(action, {
            method: 'GET',
        });
        const parsedResponse: ServerResponse = await response.json();
        if (typeof parsedResponse.serverResponse === 'string') return;
        setUser(parsedResponse.serverResponse);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (pageProps.statusCode === 404) return <Component {...pageProps} />;

    return (
        <>
            <div className="o-app">
                <MainNavigationBar
                    hasUser={() => user}
                    setUser={(user: boolean) => setUser(user)}
                    isUserStateLoading={() => typeof user === 'string'}
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
