import InputsHandler from '@/components/InputsHandler';
import SignInForm, { SIGN_IN_FORM_STATE_INPUTS } from '@/components/SignInForm';
import { useRouter } from 'next/router';

type SignInPageProps = {
    handleUserProps: HandleUserPropsType;
};

export default function SignInPage({ handleUserProps }: SignInPageProps) {
    const { hasUser, isUserStateLoading } = handleUserProps;
    const router = useRouter();
    return <>{renderContent()}</>;

    function renderContent() {
        if (isUserStateLoading) return null;
        if (!isUserStateLoading && hasUser()) {
            router.push('/dashboard-page');
            return null;
        }

        return (
            <div>
                <InputsHandler
                    ownProps={{
                        preInputs: SIGN_IN_FORM_STATE_INPUTS,
                        renderChildren: (handleInputsProps) => (
                            <SignInForm
                                handleInputsProps={handleInputsProps}
                                handleUserProps={handleUserProps}
                            />
                        ),
                    }}
                />
            </div>
        );
    }
}
