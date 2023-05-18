import SignInForm from '@/components/SignInForm';

interface SignInPageProps {
    setUser: (user: boolean) => void;
    hasUser?: () => boolean;
}

export default function SignInPage({ setUser, hasUser }: SignInPageProps) {
    return (
        <div>
            <SignInForm setUser={setUser} hasUser={hasUser} />
        </div>
    );
}
