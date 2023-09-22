import Link from 'next/link';

const API = 'api/signIn';

type MainNavigationBarProps = {
    handleUserProps: HandleUserPropsType;
};

export default function MainNavigationBar({
    handleUserProps,
}: MainNavigationBarProps) {
    const { hasUser, setHasUser, setUser, isUserStateLoading } =
        handleUserProps;
    return <>{renderContent()}</>;

    function renderContent() {
        if (isUserStateLoading) return null;

        return (
            <div className="o-navigation-bar">
                <div className="navigation-container">
                    {!hasUser && <Link href="/">Sign In</Link>}
                    {!hasUser && <Link href="/sign-up-page">Sign up</Link>}
                    {hasUser && (
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
        const options = { method: 'DELETE' };
        await fetch(API, options);
        setUser({ username: '' });
        setHasUser(false);
        window.location.assign('/');
    }
}
