import ChangePasswordForm from '@/components/ChangePasswordForm';
import ChangeUsernameForm from '@/components/ChangeUsernameForm';
import PerfilImage from '@/components/PerfilImage/PerfilImage';
import PerfilImageForm from '@/components/PerfilImage/PerfilImageForm';
import { useRouter } from 'next/router';

const HANDLE_DB_API = 'api/handleDatabase';
const SIGN_IN_API = 'api/signIn';

type DashBoardPageProps = {
    handleUserProps: HandleUserPropsType;
};

export default function DashBoardPage({ handleUserProps }: DashBoardPageProps) {
    const { hasUser, isUserStateLoading, user, setHasUser, setUser } =
        handleUserProps;
    const router = useRouter();
    const adminCheck = user.username !== 'admins';

    return <>{renderElement()}</>;

    function renderElement() {
        if (isUserStateLoading) return null;
        if (!isUserStateLoading && !hasUser) {
            router.push('/');
            return null;
        }
        const message = `welcome to dashboard page ${user.username}, and thank you to use the validate hook`;

        return (
            <div className="o-dashboard-page">
                <div>{message}</div>
                <div>
                    <PerfilImageForm handleUserProps={handleUserProps} />
                    <PerfilImage handleUserProps={handleUserProps} />
                    <ChangePasswordForm handleUserProps={handleUserProps} />
                    <ChangeUsernameForm
                        ownProps={{
                            handleUserProps: handleUserProps,
                        }}
                    />
                    {adminCheck && (
                        <button onClick={onDeleteAccount}>
                            Delete Account
                        </button>
                    )}
                    {!adminCheck && (
                        <button onClick={onResetDB}>Reset Database</button>
                    )}

                    {hasUser && (
                        <div
                            className="c-button sign-out"
                            onClick={signOutUser}
                        >
                            Sign out
                        </div>
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
            const body = user.username;
            const response = await fetch(HANDLE_DB_API, {
                body: body,
                method: 'POST',
            });
            const parsedResponse = await response.json();
            if (typeof parsedResponse === 'string') return;
            window.location.assign('/');
        }
        async function signOutUser() {
            await fetch(SIGN_IN_API, { method: 'DELETE' });
            setUser({ username: '' });
            setHasUser(false);
            if (!hasUser) {
                window.location.assign('/');
            }
        }
    }
}
