import Link from 'next/link';

type MainNavigationBarProps = HandlerUserStateProps;

export default function MainNavigationBar({
    hasUser,
    setHasUser,
    setUser,
    isUserStateLoading,
}: MainNavigationBarProps) {
    return (
        <div className="o-navigation-bar">
            <div className="navigation-container">
                {renderAlternativeContent()}
            </div>
        </div>
    );

    function renderAlternativeContent() {
        if (isUserStateLoading()) return null;

        return (
            <>
                <Link href="/">Home</Link>
                {!hasUser() && <Link href="/sign-in-page">Sign in</Link>}
                {!hasUser() && <Link href="/sign-up-page">Sign up</Link>}
                {hasUser() && <Link href="/dashboard-page">Profile</Link>}
                {hasUser() && (
                    <div className="c-button" onClick={signOutUser}>
                        Sign out
                    </div>
                )}
            </>
        );
    }

    async function signOutUser() {
        const action = process.env.NEXT_PUBLIC_SIGN_IN_LINK as string;
        const options = { method: 'DELETE' };
        await fetch(action, options);
        setUser('');
        setHasUser(false);
        window.location.assign('/sign-in-page');
    }
}
