import type { AppProps } from 'next/app';
import '../styles/sass/index.scss';
import { useCallback, useEffect, useState } from 'react';
import MainNavigationBar from '@/components/MainNavigationBar';

export default function App({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState('');
    const [hasUser, setHasUser] = useState(false);
    const [userStateLoading, setUserStateLoading] = useState(true);

    const fetchData = useCallback(async () => {
        const action = process.env.NEXT_PUBLIC_SIGN_IN_LINK as string;
        const response = await fetch(action, {
            method: 'GET',
        });
        const parsedResponse: ServerResponse = await response.json();
        setUserStateLoading(false);
        setHasUser(parsedResponse.serverResponse);
        if (parsedResponse.serverResponse) {
            setUser(parsedResponse.body);
            return;
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (pageProps.statusCode === 404) return <Component {...pageProps} />;

    return (
        <>
            <div className="o-app">
                <MainNavigationBar
                    hasUser={() => hasUser}
                    setHasUser={onUpdateHasUser}
                    user={user}
                    setUser={onUpdateUser}
                    isUserStateLoading={() => userStateLoading}
                    setUserStateLoading={onUpdateState}
                />
                <Component
                    hasUser={() => hasUser}
                    setHasUser={onUpdateHasUser}
                    user={user}
                    setUser={onUpdateUser}
                    isUserStateLoading={() => userStateLoading}
                    setUserStateLoading={onUpdateState}
                    {...pageProps}
                />
            </div>
        </>
    );

    function onUpdateUser(user: string) {
        setUser(user);
    }

    function onUpdateHasUser(value: boolean) {
        setHasUser(value);
    }

    function onUpdateState(value: boolean) {
        setUserStateLoading(value);
    }
}
