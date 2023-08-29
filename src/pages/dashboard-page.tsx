import ChangePasswordForm, {
    CHANGE_PASSWORD_FORM_INPUTS_STATE,
} from '@/components/ChangePasswordForm';
import ChangeUsernameForm, {
    CHANGE_USERNAME_FORM_INPUTS_STATE,
} from '@/components/ChangeUsernameForm';
import InputsHandler from '@/components/InputsHandler';
import PerfilImage from '@/components/PerfilImage/PerfilImage';
import PerfilImageForm, {
    PERFIL_IMAGE_FORM_INPUTS_STATE,
} from '@/components/PerfilImage/PerfilImageForm';
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
        if (!isUserStateLoading && !hasUser()) {
            router.push('/');
            return null;
        }
        const message = `welcome to dashboard page ${user.username}, and thank you to test our validate hook`;

        return (
            <div className="o-dashboard-page">
                <div>{message}</div>
                <div>
                    <InputsHandler
                        preInputs={PERFIL_IMAGE_FORM_INPUTS_STATE}
                        renderChildren={(handleInputsProps) => (
                            <PerfilImageForm
                                handleUserProps={handleUserProps}
                                handleInputsProps={handleInputsProps}
                                key={'PerfilImageForm'}
                            />
                        )}
                    />
                    <PerfilImage handleUserProps={handleUserProps} />
                    <InputsHandler
                        preInputs={CHANGE_PASSWORD_FORM_INPUTS_STATE}
                        renderChildren={(handleInputsProps) => (
                            <ChangePasswordForm
                                handleUserProps={handleUserProps}
                                handleInputsProps={handleInputsProps}
                                key={'ChangePasswordForm'}
                            />
                        )}
                    />
                    <InputsHandler
                        preInputs={CHANGE_USERNAME_FORM_INPUTS_STATE}
                        renderChildren={(handleInputsProps) => (
                            <ChangeUsernameForm
                                handleUserProps={handleUserProps}
                                handleInputsProps={handleInputsProps}
                                key={'ChangeUsernameForm'}
                            />
                        )}
                    />
                </div>
            </div>
        );
    }
}
