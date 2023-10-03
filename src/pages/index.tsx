import SignInForm from '@/components/SignInForm';

type SignInPageProps = {
    handleUserProps: HandleUserPropsType;
};

export default function SignInPage({ handleUserProps }: SignInPageProps) {
    const { hasUser, isUserStateLoading } = handleUserProps;
    return <>{renderContent()}</>;

    function renderContent() {
        if (isUserStateLoading) return null;
        if (hasUser) {
            window.location.assign('/dashboard-page');
            return null;
        }

        return <SignInForm handleUserProps={handleUserProps} />;
    }
}
