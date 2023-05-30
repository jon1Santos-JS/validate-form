import SignInForm from '@/components/SignInForm';

interface SignInPageProps {
    setUser: SetUserType;
    hasUser: HasUserType;
}

export default function SignInPage({ setUser, hasUser }: SignInPageProps) {
    return (
        <div>
            <SignInForm setUser={setUser} hasUser={hasUser} />
        </div>
    );
}
