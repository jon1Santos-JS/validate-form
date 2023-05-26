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

function onFetchDBApi(method: MethodTypes) {
    const action = process.env.NEXT_PUBLIC_HANDLE_DB_LINK as string;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return fetch(action, options);
}
