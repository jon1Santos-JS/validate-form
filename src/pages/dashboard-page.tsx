import { useRouter } from 'next/router';
import { useEffect } from 'react';

type DashBoardPageProps = HandlerUserStateProps;

export default function DashBoardPage({
    hasUser,
    user,
    isUserStateLoading,
}: DashBoardPageProps) {
    const router = useRouter();

    useEffect(() => {
        if (!hasUser() && !isUserStateLoading()) router.back();
    }, [hasUser, isUserStateLoading, router]);

    return (
        <div className="o-dashboard-page">{`welcome to dashboard page ${user}`}</div>
    );
}
