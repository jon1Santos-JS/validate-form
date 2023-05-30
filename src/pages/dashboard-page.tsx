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
    return (
        <div className="c-dashboard">
            <button
                className="button is-primary"
                onClick={async () => console.log(await onFetchDBApi('GET'))}
            >
                GETDB
            </button>
            <button
                className="button is-primary"
                onClick={async () => await onFetchDBApi('DELETE')}
            >
                DELETEDB
            </button>
        </div>
    );
}

async function onFetchDBApi(method: MethodTypes) {
    const action = process.env.NEXT_PUBLIC_HANDLE_DB_LINK as string;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = await fetch(action, options);
    const parsedResponse = await response.json();
    return parsedResponse;
}
