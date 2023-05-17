import SignInForm from '@/components/SignInForm';

interface SignInPageProps {
    setUser: (user: LogInResponseForm) => void;
}

export default function SignInPage({ setUser }: SignInPageProps) {
    return (
        <div>
            <SignInForm setUser={setUser} />
        </div>
    );
}
