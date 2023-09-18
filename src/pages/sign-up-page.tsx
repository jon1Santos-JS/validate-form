import SignUpContent from '@/components/SignUp/SignUpContent';
import { useRouter } from 'next/router';

type SignUpPageProps = {
    handleUserProps: HandleUserPropsType;
};

export default function SignUpPage({ handleUserProps }: SignUpPageProps) {
    const { hasUser, isUserStateLoading } = handleUserProps;
    const router = useRouter();

    return <>{renderContent()}</>;

    function renderContent() {
        if (isUserStateLoading) return null;
        if (!isUserStateLoading && hasUser) {
            router.push('/');
            return null;
        }

        return (
            <div className="o-sign-up-page">
                <SignUpContent handleUserProps={handleUserProps} />
            </div>
        );
    }
}
