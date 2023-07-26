import ChangePasswordForm from '@/components/ChangePasswordForm';
import ChangeUsernameForm from '@/components/ChangeUsernameForm';
import PerfilImage from '@/components/PerfilImageForm';
import { useRouter } from 'next/router';

type DashBoardPageProps = HandlerUserStateProps;

export default function DashBoardPage({
    hasUser,
    isUserStateLoading,
    user,
    ...restProps
}: DashBoardPageProps) {
    const router = useRouter();

    return <>{renderElement()}</>;

    function renderElement() {
        if (isUserStateLoading) return null;
        if (!isUserStateLoading && !hasUser()) {
            router.push('/');
            return null;
        }
        const message = `welcome to dashboard page ${user}, and thank you to test our validate hook`;

        return (
            <div className="o-dashboard-page">
                <div>{message}</div>
                <div>
                    <PerfilImage
                        hasUser={hasUser}
                        isUserStateLoading={isUserStateLoading}
                        user={user}
                        {...restProps}
                    />
                    <ChangePasswordForm
                        hasUser={hasUser}
                        user={user}
                        isUserStateLoading={isUserStateLoading}
                        {...restProps}
                    />
                    <ChangeUsernameForm
                        hasUser={hasUser}
                        user={user}
                        isUserStateLoading={isUserStateLoading}
                        {...restProps}
                    />
                </div>
            </div>
        );
    }
}
