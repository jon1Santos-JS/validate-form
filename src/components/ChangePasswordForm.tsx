import Form from './Form';
import Input from './Input';
import { useRouter } from 'next/router';

type ChangePasswordFormPropsTypes = {
    handleUserProps: HandleUserPropsType;
    handleInputsProps: HandleInputsPropsType<ChangePasswordInputs>;
};
type ChangePasswordInputs = 'password' | 'newPassword' | 'confirmNewPassword';

export default function ChangePasswordForm({
    handleUserProps,
    handleInputsProps,
}: ChangePasswordFormPropsTypes) {
    const router = useRouter();
    const { user } = handleUserProps;
    const { onChangeInput } = handleInputsProps;

    return <>{renderContent()}</>;

    function renderContent() {
        if (
            user.username === (process.env.NEXT_PUBLIC_ADMIN_USERNAME as string)
        )
            return null;

        return (
            <Form
                ownProps={{
                    legend: 'Change Password',
                    onSubmitInputs: onSubmitInputs,
                }}
                handleInputsProps={handleInputsProps}
            >
                <Input
                    ownProps={{
                        label: 'Password',
                        inputType: 'password',
                        objectifiedName: 'password',
                        onChange: (e) => onChange(e, 'password'),
                    }}
                    handleInputsProps={handleInputsProps}
                />
                <Input
                    ownProps={{
                        label: 'New Password',
                        inputType: 'password',
                        objectifiedName: 'newPassword',
                        onChange: (e) => onChange(e, 'newPassword'),
                    }}
                    handleInputsProps={handleInputsProps}
                />
                <Input
                    ownProps={{
                        label: 'Confirm New Password',
                        inputType: 'password',
                        objectifiedName: 'confirmNewPassword',
                        onChange: (e) => onChange(e, 'confirmNewPassword'),
                    }}
                    handleInputsProps={handleInputsProps}
                />
            </Form>
        );
    }

    function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        name: ChangePasswordInputs,
    ) {
        onChangeInput({
            objectifiedName: name,
            targetProp: 'value',
            value: e.target.value,
        });
    }

    async function onSubmitInputs(
        handledInputs: FormHandledInputsType<ChangePasswordInputs>,
    ) {
        const action = process.env.NEXT_PUBLIC_CHANGE_PASSWORD_LINK as string;
        const handledBody = {
            username: { value: user.username },
            ...handledInputs,
        };
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledBody),
        };
        const response = await fetch(action, options);
        const parsedResponse: ServerResponse = await response.json();
        if (!parsedResponse.serverResponse) return;
        router.reload();
    }
}

export const CHANGE_PASSWORD_FORM_INPUTS_STATE: PreFormInputsType<ChangePasswordInputs> =
    {
        password: {
            validations: (currentInputValue) => [
                {
                    coditional: !currentInputValue.match(/.{6,}/),
                    message: 'Password incorrect',
                },
            ],
            required: 'Password incorrect',
        },
        newPassword: {
            validations: (currentInputValue, formInputs) => [
                {
                    coditional: !currentInputValue.match(/.{6,}/),
                    message: 'Password must has 6 characters at least',
                },
                {
                    coditional:
                        currentInputValue === formInputs['password'].value,
                    message:
                        'This field have to be different than the password',
                },
                {
                    coditional:
                        currentInputValue !==
                        formInputs['confirmNewPassword'].value,
                    message:
                        'This field has to be equal to the confirm new password',
                },
            ],
            required: 'New password incorrect',
        },
        confirmNewPassword: {
            validations: (currentInputValue, formInputs) => [
                {
                    coditional:
                        currentInputValue !== formInputs['newPassword'].value,
                    message: 'This field has to be equal to the new password',
                },
            ],
            required: 'Confirm new password incorrect',
        },
    };
