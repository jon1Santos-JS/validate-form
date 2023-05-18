export default function DashBoardPage() {
    return (
        <div className="c-dashboard">
            <button
                className="button is-primary"
                onClick={() => onFetchDBApi('GET')}
            >
                GETDB
            </button>
            <button
                className="button is-primary"
                onClick={() => onFetchDBApi('DELETE')}
            >
                DELETEDB
            </button>
        </div>
    );
}

function onFetchDBApi(method: 'DELETE' | 'GET' | 'POST') {
    return fetch(process.env.NEXT_PUBLIC_HANDLE_DB_LINK as string, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
