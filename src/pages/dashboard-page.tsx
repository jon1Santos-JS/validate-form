import ChangePasswordForm, {
    CHANGE_PASSWORD_FORM_INPUTS_STATE,
} from '@/components/ChangePasswordForm';
import ChangeUsernameForm, {
    CHANGE_USERNAME_FORM_INPUTS_STATE,
} from '@/components/ChangeUsernameForm';
import InputsHandler from '@/components/InputsHandler';
import PerfilImageForm, {
    PERFIL_IMAGE_FORM_INPUTS_STATE,
} from '@/components/PerfilImageForm';
import { useRouter } from 'next/router';

type DashBoardPageProps = HandlerUserStateProps;

export default function DashBoardPage({
    hasUser,
    isUserStateLoading,
    user,
    ...restProps
}: DashBoardPageProps) {
    const router = useRouter();

    return <>{renderElement()}</>;

    function renderElement() {
        if (isUserStateLoading) return null;
        if (!isUserStateLoading && !hasUser()) {
            router.push('/');
            return null;
        }
        const message = `welcome to dashboard page ${user.username}, and thank you to test our validate hook`;

        return (
            <div className="o-dashboard-page">
                <div>{message}</div>
                <div>
                    <InputsHandler preInputs={PERFIL_IMAGE_FORM_INPUTS_STATE}>
                        <PerfilImageForm
                            hasUser={hasUser}
                            isUserStateLoading={isUserStateLoading}
                            user={user}
                            {...restProps}
                        />
                    </InputsHandler>
                    <InputsHandler
                        preInputs={CHANGE_PASSWORD_FORM_INPUTS_STATE}
                    >
                        <ChangePasswordForm
                            hasUser={hasUser}
                            user={user}
                            isUserStateLoading={isUserStateLoading}
                            {...restProps}
                        />
                    </InputsHandler>
                    <InputsHandler
                        preInputs={CHANGE_USERNAME_FORM_INPUTS_STATE}
                    >
                        <ChangeUsernameForm
                            hasUser={hasUser}
                            user={user}
                            isUserStateLoading={isUserStateLoading}
                            {...restProps}
                        />
                    </InputsHandler>
                </div>
            </div>
        );
    }
}
