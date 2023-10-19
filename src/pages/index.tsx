import SignInForm from '@/components/SignInForm';
import { useUser } from '@/context/UserContext';

export default function SignInPage() {
    const {
        userState: { hasUser, isUserStateLoading },
    } = useUser();
    return <>{renderContent()}</>;

    function renderContent() {
        if (isUserStateLoading) return null;
        if (hasUser) {
            window.location.assign('/dashboard-page');
            return null;
        }

        return <SignInForm />;
    }
}
