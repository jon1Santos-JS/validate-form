import Description from '@/components/Description/Description';
import DescriptionModal from '@/components/Description/DescriptionModal';
import SignInForm from '@/components/SignInForm';
import { useAuth } from '@/context/UserContext';

export default function SignInPage() {
    const { userState } = useAuth();
    return <>{renderContent()}</>;

    function renderContent() {
        if (userState.isLoading) return null;
        if (userState.hasUser) {
            window.location.assign('/dashboard-page');
            return null;
        }

        return (
            <div className="o-sign-in-page">
                <DescriptionModal />
                <div className="description-container">
                    <Description />
                </div>
                <SignInForm />
            </div>
        );
    }
}
