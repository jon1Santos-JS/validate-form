import Form from './Form';
import Input from './Input';
import InputsHandler from './InputsHandler';
import { useRouter } from 'next/router';

type ChangePasswordFormPropsTypes = HandlerUserStateProps;

export default function ChangePasswordForm({
    user,
}: ChangePasswordFormPropsTypes) {
    const router = useRouter();

    return <>{renderContent()}</>;

    function renderContent() {
        if (user === (process.env.NEXT_PUBLIC_ADMIN_USERNAME as string))
            return null;

        return (
            <InputsHandler preInputs={preInputs}>
                <Form legend="Change Password" onSubmitInputs={onSubmitInputs}>
                    <Input
                        label="Password"
                        inputType="password"
                        fieldName="password"
                        attributes={['value']}
                    />
                    <Input
                        label="New Password"
                        inputType="password"
                        fieldName="newPassword"
                        attributes={['value']}
                    />
                    <Input
                        label="Confirm New Password"
                        inputType="password"
                        fieldName="confirmNewPassword"
                        attributes={['value']}
                    />
                </Form>
            </InputsHandler>
        );
    }

    async function onSubmitInputs<T>(contentToSubmit: T) {
        const action = process.env.NEXT_PUBLIC_CHANGE_PASSWORD_LINK as string;
        const handledBody = { username: { value: user }, ...contentToSubmit };
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

const preInputs: PreFormInputsType = {
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
                coditional: currentInputValue === formInputs['password'].value,
                message: 'This field have to be different than the password',
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
