import ChangePasswordForm from '@/components/ChangePasswordForm';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

type DashBoardPageProps = HandlerUserStateProps;

export default function DashBoardPage({
    hasUser,
    setHasUser,
    isUserStateLoading,
    user,
    setUser,
}: DashBoardPageProps) {
    const router = useRouter();

    useEffect(() => {
        if (!hasUser() && !isUserStateLoading()) router.back();
    }, [hasUser, isUserStateLoading, router]);

    return <>{renderElement()}</>;

    function renderElement() {
        if (!hasUser()) return null;
        return (
            <div className="o-dashboard-page">
                <div>{`welcome to dashboard page ${user}`}</div>
                <div>
                    <ChangePasswordForm
                        hasUser={hasUser}
                        setHasUser={setHasUser}
                        isUserStateLoading={isUserStateLoading}
                        user={user}
                        setUser={setUser}
                    />
                </div>
            </div>
        );
    }
}
