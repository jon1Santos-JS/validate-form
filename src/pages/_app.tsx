import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/sass/index.scss';
import { useCallback, useEffect, useState } from 'react';
import MainNavigationBar from '@/components/MainNavigationBar';
const API = 'api/signIn';

export default function App({ Component, pageProps }: AppProps) {
    const [userProps, setUserProps] = useState({
        user: { username: '' } as UserType,
        hasUser: false,
        isUserStateLoading: true,
        setHasUser: onUpdateHasUser,
        setUser: onUpdateUser,
        setUserStateLoading: onUpdateState,
    });

    const onCheckUserState = useCallback(async () => {
        const response = await fetch(API, {
            method: 'GET',
        });
        const parsedResponse: ServerResponse = await response.json();
        setUserProps((prev) => ({
            ...prev,
            hasUser: parsedResponse.serverResponse,
            isUserStateLoading: false,
        }));
        if (
            parsedResponse.serverResponse &&
            typeof parsedResponse.body !== 'string'
        ) {
            setUserProps((prev) => ({
                ...prev,
                user: parsedResponse.body as UserType,
            }));
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
                <MainNavigationBar handleUserProps={userProps} />
                <Component handleUserProps={userProps} {...pageProps} />
            </div>
        </>
    );

    function onUpdateUser({
        username,
        userImage = userProps.user.userImage,
    }: UserType) {
        setUserProps((prev) => ({
            ...prev,
            user: { username, userImage },
        }));
    }

    function onUpdateHasUser(value: boolean) {
        setUserProps((prev) => ({
            ...prev,
            hasUser: value,
        }));
    }

    function onUpdateState(value: boolean) {
        setUserProps((prev) => ({
            ...prev,
            isUserStateLoading: value,
        }));
    }
}
