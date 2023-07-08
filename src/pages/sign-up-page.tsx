import SignUpContent from '@/components/SignUp/SignUpContent';
import { useRouter } from 'next/router';

type SignUpPageProps = HandlerUserStateProps;

export default function SignUpPage({
    hasUser,
    isUserStateLoading,
}: SignUpPageProps) {
    const router = useRouter();

    return <>{renderContent()}</>;

    function renderContent() {
        if (isUserStateLoading) return null;
        if (!isUserStateLoading && hasUser()) {
            router.push('/');
            return null;
        }

        return (
            <div className="o-sign-up-page">
                <SignUpContent />
            </div>
        );
    }
}
