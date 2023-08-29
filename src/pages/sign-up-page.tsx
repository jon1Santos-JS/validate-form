import InputsHandler from '@/components/InputsHandler';
import SignUpContent from '@/components/SignUp/SignUpContent';
import { SIGN_UP_FORM_INPUTS_STATE } from '@/components/SignUp/SignUpForm';
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
        if (!isUserStateLoading && hasUser()) {
            router.push('/');
            return null;
        }

        return (
            <div className="o-sign-up-page">
                <InputsHandler
                    renderChildren={(handleInputsProps) => (
                        <SignUpContent
                            handleInputsProps={handleInputsProps}
                            handleUserProps={handleUserProps}
                            key={'SignUpContent'}
                        />
                    )}
                    preInputs={SIGN_UP_FORM_INPUTS_STATE}
                />
            </div>
        );
    }
}
