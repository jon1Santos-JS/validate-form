import ChangePasswordForm from '@/components/ChangePasswordForm';
import ChangeUsernameForm from '@/components/ChangeUsernameForm';
import { useAuth } from '@/context/UserContext';
import { useRouter } from 'next/router';
import Perfil from '@/components/PerfilImage/Perfil';
import { PerfilImageProvider } from '@/context/UserPerfilImageContext';
import PerfilModal from '@/components/PerfilImage/PerfilModal';
import DashboardModal from '@/components/DashboardModal';
import { useState } from 'react';
import WarningModal from '@/components/WarningModal';

const HANDLE_DB_API = 'api/handleDatabase';
const DELETE_API = 'api/deleteUser';
const SIGN_IN_API = 'api/signIn';
const RESET_DATABASE_QUESTION = 'Are you sure you want to reset the database?';
const RESET_DATABASE_SUCCESS = 'Database was reset successfully';
const DELETE_ACCOUNT_QUESTION = 'Are you sure you want to delete your account?';

export default function DashBoardPage() {
    const {
        user: { username },
        setUser,
        userState,
        setUserState,
    } = useAuth();
    const router = useRouter();
    const isAdmin = username === process.env.NEXT_PUBLIC_ADMINS_USERNAME;
    const [isRequesting, setRequestState] = useState(false);
    const [isUsernameModalOpen, onOpenUsernameModal] = useState(false);
    const [isPasswordModalOpen, onOpenPasswordModal] = useState(false);
    const [isResetDBModalOpen, onOpenResetDBModal] = useState(false);
    const [isDelAccountModalOpen, onOpenDelAccountModal] = useState(false);
    const [isWarningModalOpen, onOpenWarningModal] = useState(false);

    return <>{renderElement()}</>;

    function renderElement() {
        if (userState.isLoading) return null;
        if (!userState.isLoading && !userState.hasUser) {
            router.push('/');
            return null;
        }
        const welcomeMessage = `Welcome to dashboard page and thank you to test the validate hook`;

        return (
            <div className="o-dashboard-page l-bg--secondary">
                <div className="container">
                    <PerfilImageProvider>
                        <>
                            <Perfil />
                            <PerfilModal />
                        </>
                    </PerfilImageProvider>

                    <h2 className="username">
                        {username.replace(
                            username.charAt(0),
                            username.charAt(0).toUpperCase(),
                        )}
                    </h2>
                    <h3 className="welcome-message">{welcomeMessage}</h3>

                    {!isAdmin && (
                        <button
                            className="l-bg--thirty c-button button"
                            onClick={() => onOpenUsernameModal(true)}
                        >
                            Change Username
                        </button>
                    )}

                    {!isAdmin && (
                        <button
                            className="l-bg--thirty c-button button"
                            onClick={() => onOpenPasswordModal(true)}
                        >
                            Change Password
                        </button>
                    )}

                    {!isAdmin && (
                        <button
                            className="l-bg--thirty c-button button"
                            onClick={() => onOpenDelAccountModal(true)}
                        >
                            Delete Account
                        </button>
                    )}
                    {userState.hasUser && (
                        <button
                            className="l-bg--thirty c-button button"
                            onClick={signOutUser}
                        >
                            Sign out
                        </button>
                    )}
                    {isAdmin && (
                        <button
                            className="l-bg--thirty c-button button"
                            onClick={() => onOpenResetDBModal(true)}
                        >
                            Reset Database
                        </button>
                    )}
                    {!isAdmin && (
                        <DashboardModal
                            isOpen={isUsernameModalOpen}
                            onClose={() => {
                                if (isRequesting) return;
                                onOpenUsernameModal(false);
                            }}
                        >
                            <ChangeUsernameForm
                                isRequesting={isRequesting}
                                setRequestState={setRequestState}
                            />
                        </DashboardModal>
                    )}
                    {!isAdmin && (
                        <DashboardModal
                            isOpen={isPasswordModalOpen}
                            onClose={() => {
                                if (isRequesting) return;
                                onOpenPasswordModal(false);
                            }}
                        >
                            <ChangePasswordForm
                                isRequesting={isRequesting}
                                setRequestState={setRequestState}
                            />
                        </DashboardModal>
                    )}

                    {isAdmin && (
                        <DashboardModal
                            isOpen={isResetDBModalOpen}
                            onClose={() => onOpenResetDBModal(false)}
                        >
                            <div className="o-question-modal">
                                <div className="question">
                                    {RESET_DATABASE_QUESTION}
                                </div>
                                <div className="buttons">
                                    <button
                                        className="c-button button"
                                        onClick={async () => {
                                            if (isRequesting) return;
                                            await onResetDB();
                                        }}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="c-button button"
                                        onClick={() => {
                                            if (isRequesting) return;
                                            onOpenResetDBModal(false);
                                        }}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </DashboardModal>
                    )}

                    {!isAdmin && (
                        <DashboardModal
                            isOpen={isDelAccountModalOpen}
                            onClose={() => onOpenDelAccountModal(false)}
                        >
                            <div className="o-question-modal">
                                <div className="question">
                                    {DELETE_ACCOUNT_QUESTION}
                                </div>
                                <div className="buttons">
                                    <button
                                        className="c-button button"
                                        onClick={async () => {
                                            if (isRequesting) return;
                                            await onDeleteAccount();
                                        }}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="c-button button"
                                        onClick={() => {
                                            if (isRequesting) return;
                                            onOpenDelAccountModal(false);
                                        }}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </DashboardModal>
                    )}
                    {isAdmin && (
                        <WarningModal
                            isOpen={isWarningModalOpen}
                            onClose={() => onOpenWarningModal(false)}
                            message={RESET_DATABASE_SUCCESS}
                            className="l-bg--success"
                        />
                    )}
                </div>
            </div>
        );

        async function onResetDB() {
            setRequestState(true);
            const response = await fetch(HANDLE_DB_API, { method: 'GET' });
            const parsedResponse: DBDefaultResponse = await response.json();
            if (!parsedResponse.success) return;
            onOpenResetDBModal(false);
            setRequestState(false);
            onOpenWarningModal(true);
        }

        async function onDeleteAccount() {
            setRequestState(true);
            const response = await fetch(DELETE_API, {
                method: 'GET',
            });
            const parsedResponse = await response.json();
            if (typeof parsedResponse === 'string') return;
            window.location.assign('/');
            setRequestState(false);
        }

        async function signOutUser() {
            await fetch(SIGN_IN_API, { method: 'DELETE' });
            setUser((prev) => ({ ...prev, username: '' }));
            setUserState((prev) => ({ ...prev, hasUser: false }));
            if (!userState.hasUser) {
                window.location.assign('/');
            }
        }
    }
}
