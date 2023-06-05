import Link from 'next/link';
import { useRouter } from 'next/router';

interface MainNavigationBarProps {
    hasUser: HasUserType;
    setUser: SetUserType;
    isUserStateLoading: IsUserStateLoadingType;
}

export default function MainNavigationBar({
    hasUser,
    setUser,
    isUserStateLoading,
}: MainNavigationBarProps) {
    const router = useRouter();

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
                {hasUser() && (
                    <div className="c-button" onClick={signOutUser}>
                        Sign out
                    </div>
                )}
                {hasUser() && <Link href="/dashboard-page">Profile</Link>}
            </>
        );
    }

    async function signOutUser() {
        setUser(false);
        const action = process.env.NEXT_PUBLIC_SIGN_IN_LINK as string;
        const options = { method: 'DELETE' };
        await fetch(action, options);
        router.push('/sign-in-page');
    }
}
