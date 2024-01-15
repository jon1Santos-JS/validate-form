import WarningModal from '@/components/WarningModal';
import Description from '@/components/Description/Description';
import DescriptionModal from '@/components/Description/DescriptionModal';
import SignUpForm from '@/components/SignUpForm';
import { useAuth } from '@/context/UserContext';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function SignUpPage() {
    const { userState } = useAuth();
    const router = useRouter();
    const [limitErrorMessage, setLimitErrorMessage] = useState('');
    const [isDangerModalOpen, onOpenDangerModal] = useState(false);

    return <>{renderContent()}</>;

    function renderContent() {
        if (userState.isLoading) return null;
        if (!userState.isLoading && userState.hasUser) {
            router.push('/');
            return null;
        }

        return (
            <div className="o-sign-up-page">
                <DescriptionModal />
                <div className="description-container">
                    <Description />
                </div>
                <SignUpForm
                    setModalMessage={(message) => setLimitErrorMessage(message)}
                    onOpenDangerModal={() => onOpenDangerModal(true)}
                    isDangerModalOpen={isDangerModalOpen}
                />
                <WarningModal
                    message={limitErrorMessage}
                    isOpen={isDangerModalOpen}
                    onClose={() => onOpenDangerModal(false)}
                    className="l-bg--danger"
                />
            </div>
        );
    }
}
