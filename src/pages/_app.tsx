import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/sass/index.scss';
import { useCallback, useEffect, useState } from 'react';
import MainNavigationBar from '@/components/MainNavigationBar';

export default function App({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState<UserType>({ username: '' });
    const [hasUser, setHasUser] = useState(false);
    const [userStateLoading, setUserStateLoading] = useState(true);

    const onCheckUserState = useCallback(async () => {
        const action = process.env.NEXT_PUBLIC_SIGN_IN_LINK as string;
        const response = await fetch(action, {
            method: 'GET',
        });
        const parsedResponse: ServerResponse = await response.json();
        setHasUser(parsedResponse.serverResponse);
        setUserStateLoading(false);
        if (
            parsedResponse.serverResponse &&
            typeof parsedResponse.body !== 'string'
        ) {
            setUser(parsedResponse.body);
            return;
        }
    }, []);

    useEffect(() => {
        onCheckUserState();
    }, [onCheckUserState]);

    if (pageProps.statusCode === 404) return <Component {...pageProps} />;

    return (
        <>
            <div className="o-app">
                <Head>
                    <link rel="icon" href="data:,"></link>
                </Head>
                <MainNavigationBar
                    hasUser={() => hasUser}
                    setHasUser={onUpdateHasUser}
                    user={user}
                    setUser={onUpdateUser}
                    isUserStateLoading={userStateLoading}
                    setUserStateLoading={onUpdateState}
                />
                <Component
                    hasUser={() => hasUser}
                    setHasUser={onUpdateHasUser}
                    user={user}
                    setUser={onUpdateUser}
                    isUserStateLoading={userStateLoading}
                    setUserStateLoading={onUpdateState}
                    {...pageProps}
                />
            </div>
        </>
    );

    function onUpdateUser({ username, userImage = user.userImage }: UserType) {
        setUser({ username, userImage });
    }

    function onUpdateHasUser(value: boolean) {
        setHasUser(value);
    }

    function onUpdateState(value: boolean) {
        setUserStateLoading(value);
    }
}
