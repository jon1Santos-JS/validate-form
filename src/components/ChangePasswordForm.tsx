import Form from './Form';
import Input from './Input';
import InputsHandler from './InputsHandler';
import { useRouter } from 'next/router';

type ChangePasswordFormPropsTypes = HandlerUserStateProps;

export default function ChangePasswordForm({
    user,
}: ChangePasswordFormPropsTypes) {
    const router = useRouter();

    return (
        <InputsHandler preInputs={preInputs}>
            <Form legend="Change Password" onSubmitInputs={onSubmitInputs}>
                <Input
                    label="Password"
                    inputType="password"
                    fieldName="password"
                />
                <Input
                    label="New Password"
                    inputType="password"
                    fieldName="newPassword"
                />
                <Input
                    label="Confirm New Password"
                    inputType="password"
                    fieldName="confirmNewPassword"
                />
            </Form>
        </InputsHandler>
    );

    async function onSubmitInputs<T>(formContent: T) {
        const action = process.env.NEXT_PUBLIC_CHANGE_PASSWORD_LINK as string;
        const handledBody = { username: { value: user }, ...formContent };
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledBody),
        };
        const response = await fetch(action, options);
        const parsedResponse: ServerResponse = await response.json();
        if (typeof parsedResponse.serverResponse !== 'string') {
            if (!parsedResponse.serverResponse) return;
            router.reload();
            return;
        }
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
