import ChangePasswordForm from '@/components/ChangePasswordForm';
import ChangeUsernameForm from '@/components/ChangeUsernameForm';
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

        return (
            <div className="o-dashboard-page">
                <div>{`welcome to dashboard page ${user}`}</div>
                <div>
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
