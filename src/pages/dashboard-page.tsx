import ChangePasswordForm from '@/components/ChangePasswordForm';
import ChangeUsernameForm from '@/components/ChangeUsernameForm';
import PerfilImage from '@/components/PerfilImage/PerfilImage';
import PerfilImageForm from '@/components/PerfilImage/PerfilImageForm';
import { useRouter } from 'next/router';

type DashBoardPageProps = {
    handleUserProps: HandleUserPropsType;
};

export default function DashBoardPage({ handleUserProps }: DashBoardPageProps) {
    const { hasUser, isUserStateLoading, user } = handleUserProps;
    const router = useRouter();

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
                </div>
            </div>
        );
    }
}
