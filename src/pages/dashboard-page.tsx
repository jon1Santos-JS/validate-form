import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface DashBoardPageProps {
    setUser: SetUserType;
    hasUser: HasUserType;
}

export default function DashBoardPage({ hasUser }: DashBoardPageProps) {
    const router = useRouter();

    useEffect(() => {
        if (!hasUser()) router.back();
    }, [hasUser, router]);

    return <div className="c-dashboard">{`welcome to dashboard page`}</div>;
}
