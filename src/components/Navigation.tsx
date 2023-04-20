import Link from 'next/link';

export default function NavigationBar() {
    return (
        <div className="o-navigation-bar">
            <Link href="/">Home</Link>
            <Link href="/sign-in-page">Sign In</Link>
            <Link href="/sign-up-page">Sign Up</Link>
        </div>
    );
}
