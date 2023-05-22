import type { AppProps } from 'next/app';
import '../styles/sass/index.scss';
import { useCallback, useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import useAPIrequest from '@/hooks/useAPIrequest';

export default function App({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState<boolean>(false);
    const { requestWithouContent } = useAPIrequest();

    const fetchData = useCallback(async () => {
        const action = process.env.NEXT_PUBLIC_SIGN_IN_LINK as string;
        setUser(await requestWithouContent(action, { method: 'GET' }));
    }, [requestWithouContent]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
