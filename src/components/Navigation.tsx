'use client';

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
    const router = useRouter();
    return (
        <div className="o-navigation-bar">
            <div className="navigation-container">
                <Link href="/">Home</Link>
                {!hasUser() && <Link href="/sign-in-page">Sign in</Link>}
                {!hasUser() && <Link href="/sign-up-page">Sign up</Link>}
                {hasUser() && (
                    <div
                        className="c-button"
                        onClick={async () => {
                            setUser(false);
                            await signOutUser();
                            router.reload();
                        }}
                    >
                        Sign out
                    </div>
                )}
            </div>
        </div>
    );
}

async function signOutUser() {
    const response = await fetch(
        process.env.NEXT_PUBLIC_SIGN_IN_LINK as string,
        { method: 'DELETE' },
    );
    const parsedResponse: LogInResponseForm = await response.json();
    return parsedResponse.user;
}
