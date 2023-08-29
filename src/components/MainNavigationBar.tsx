import Link from 'next/link';

type MainNavigationBarProps = HandlerUserStateProps;

export default function MainNavigationBar({
    hasUser,
    setHasUser,
    setUser,
    isUserStateLoading,
}: MainNavigationBarProps) {
    return <>{renderContent()}</>;

    function renderContent() {
        if (isUserStateLoading) return null;

        return (
            <div className="o-navigation-bar">
                <div className="navigation-container">
                    {!hasUser() && <Link href="/">Sign In</Link>}
                    {!hasUser() && <Link href="/sign-up-page">Sign up</Link>}
                    {hasUser() && (
                        <div
                            className="c-button sign-out"
                            onClick={signOutUser}
                        >
                            Sign out
                        </div>
                    )}
                </div>
            </div>
        );
    }

    async function signOutUser() {
        const action = process.env.NEXT_PUBLIC_SIGN_IN_LINK as string;
        const options = { method: 'DELETE' };
        await fetch(action, options);
        setUser({ username: '' });
        setHasUser(false);
        window.location.assign('/');
    }
}
