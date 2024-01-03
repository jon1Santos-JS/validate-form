import ChangePasswordForm from '@/components/ChangePasswordForm';
import ChangeUsernameForm from '@/components/ChangeUsernameForm';
import PerfilImage from '@/components/PerfilImage/PerfilImage';
import PerfilImageForm from '@/components/PerfilImage/PerfilImageForm';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/router';

const HANDLE_DB_API = 'api/handleDatabase';
const DELETE_API = 'api/deleteUser';
const SIGN_IN_API = 'api/signIn';

export default function DashBoardPage() {
    const {
        user: { username, setUsername },
        userState: { hasUser, isUserStateLoading, setHasUser },
    } = useUser();
    const router = useRouter();
    const adminCheck = username !== process.env.NEXT_PUBLIC_ADMINS_USERNAME;

    return <>{renderElement()}</>;

    function renderElement() {
        if (isUserStateLoading) return null;
        if (!isUserStateLoading && !hasUser) {
            router.push('/');
            return null;
        }
        const message = `welcome to dashboard page ${username}, and thank you to use the validate hook`;

        return (
            <div className="o-dashboard-page">
                <div>{message}</div>
                <div>
                    <PerfilImageForm />
                    <PerfilImage />
                    <ChangePasswordForm />
                    <ChangeUsernameForm />
                    {adminCheck && (
                        <button onClick={onDeleteAccount}>
                            Delete Account
                        </button>
                    )}
                    {!adminCheck && (
                        <button onClick={onResetDB}>Reset Database</button>
                    )}
                    {hasUser && (
                        <button
                            className="c-button sign-out"
                            onClick={signOutUser}
                        >
                            Sign out
                        </button>
                    )}
                </div>
            </div>
        );

        async function onResetDB() {
            const response = await fetch(HANDLE_DB_API, { method: 'GET' });
            const parsedResponse = await response.json();
            if (typeof parsedResponse === 'string') return;
            window.location.assign('/');
        }

        async function onDeleteAccount() {
            const response = await fetch(DELETE_API, {
                method: 'GET',
            });
            const parsedResponse = await response.json();
            if (typeof parsedResponse === 'string') return;
            window.location.assign('/');
        }

        async function signOutUser() {
            await fetch(SIGN_IN_API, { method: 'DELETE' });
            setUsername('');
            setHasUser(false);
            if (!hasUser) {
                window.location.assign('/');
            }
        }
    }
}
