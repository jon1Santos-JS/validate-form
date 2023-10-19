import SignUpContent from '@/components/SignUp/SignUpContent';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/router';

export default function SignUpPage() {
    const {
        userState: { hasUser, isUserStateLoading },
    } = useUser();
    const router = useRouter();

    return <>{renderContent()}</>;

    function renderContent() {
        if (isUserStateLoading) return null;
        if (!isUserStateLoading && hasUser) {
            router.push('/');
            return null;
        }

        return <SignUpContent />;
    }
}
