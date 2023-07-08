import SignInForm from '@/components/SignInForm';
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
            router.push('/');
            return null;
        }

        return (
            <div>
                <SignInForm
                    hasUser={hasUser}
                    isUserStateLoading={isUserStateLoading}
                    {...restProps}
                />
            </div>
        );
    }
}
