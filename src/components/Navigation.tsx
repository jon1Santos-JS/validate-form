import useRequest from '@/hooks/useAPIrequest';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavigationBarProps {
    hasUser: () => boolean;
    setUser: (user: boolean) => void;
}

export default function NavigationBar({
    hasUser,
    setUser,
}: NavigationBarProps) {
    const { requestWithouContent } = useRequest();
    const router = useRouter();

    return (
        <div className="o-navigation-bar">
            <div className="navigation-container">
                <Link href="/">Home</Link>
                {!hasUser() && <Link href="/sign-in-page">Sign in</Link>}
                {!hasUser() && <Link href="/sign-up-page">Sign up</Link>}
                {hasUser() && (
                    <div className="c-button" onClick={signOutUser}>
                        Sign out
                    </div>
                )}
            </div>
        </div>
    );

    async function signOutUser() {
        setUser(false);
        await requestWithouContent(
            process.env.NEXT_PUBLIC_SIGN_IN_LINK as string,
            {
                method: 'DELETE',
            },
        );
        router.push('/sign-in-page');
    }
}
