import SignUpForm from '@/components/SignUpForm';

interface SignUpPageProps {
    setUser: (user: boolean) => void;
    hasUser: () => boolean;
}

export default function signUpPage({ setUser, hasUser }: SignUpPageProps) {
    return (
        <div className="o-sign-up-page">
            <SignUpForm setUser={setUser} hasUser={() => hasUser()} />
        </div>
    );
}
