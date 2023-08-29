import InputsHandler from '@/components/InputsHandler';
import SignInForm, { SIGN_IN_FORM_STATE_INPUTS } from '@/components/SignInForm';
import { useRouter } from 'next/router';

type SignInPageProps = HandlerUserStateProps;

export default function SignInPage({
    hasUser,
    isUserStateLoading,
    ...restProps
}: SignInPageProps) {
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
                <InputsHandler preInputs={SIGN_IN_FORM_STATE_INPUTS}>
                    <SignInForm
                        hasUser={hasUser}
                        isUserStateLoading={isUserStateLoading}
                        {...restProps}
                    />
                </InputsHandler>
            </div>
        );
    }
}
