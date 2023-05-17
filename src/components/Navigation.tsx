'use client';

import Link from 'next/link';

interface NavigationBarProps {
    hasUser: () => LogInResponseForm;
    setUser: (user: LogInResponseForm) => void;
}

export default function NavigationBar({
    hasUser,
    setUser,
}: NavigationBarProps) {
    return (
        <div className="o-navigation-bar">
            <div className="navigation-container">
                <Link href="/">Home</Link>
                {!hasUser() && <Link href="/sign-in-page">Sign in</Link>}
                {!hasUser() && <Link href="/sign-up-page">Sign up</Link>}
                {hasUser() && (
                    <div className="c-button" onClick={() => setUser(null)}>
                        Sign out
                    </div>
                )}
            </div>
        </div>
    );
}
