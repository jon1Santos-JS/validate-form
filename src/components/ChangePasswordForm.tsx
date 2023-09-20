import { useState } from 'react';
import Form from './Form';
import Input from './Input';
import { useRouter } from 'next/router';
import { omitFields } from '@/hooks/useInputsHandler';

type ChangePasswordFormPropsTypes = {
    handleUserProps: HandleUserPropsType;
};

export default function ChangePasswordForm({
    handleUserProps,
}: ChangePasswordFormPropsTypes) {
    const router = useRouter();
    const { user } = handleUserProps;
    const [areValid, setAreValid] = useState(false);
    const [inputs, setInputs] = useState(INPUTS_INITIAL_STATE);

    return <>{renderContent()}</>;

    function renderContent() {
        if (
            user.username ===
            (process.env.NEXT_PUBLIC_ADMINS_USERNAME as string)
        )
            return null;

        return (
            <Form
                ownProps={{
                    legend: 'Change Password',
                    onSubmitInputs: onSubmitInputs,
                }}
                validateProps={{
                    inputs,
                    setShowInputsMessage,
                }}
            >
                <Input
                    ownProps={{
                        label: 'Password',
                        inputType: 'password',
                        onChange: (e) => onChange(e, 'password'),
                    }}
                    validateProps={{
                        inputs,
                        input: inputs.password,
                        showInputMessagesFromOutside: areValid,
                    }}
                />
                <Input
                    ownProps={{
                        label: 'New Password',
                        inputType: 'password',
                        onChange: (e) => onChange(e, 'newPassword'),
                    }}
                    validateProps={{
                        inputs,
                        input: inputs.newPassword,
                        showInputMessagesFromOutside: areValid,
                    }}
                />
                <Input
                    ownProps={{
                        label: 'Confirm New Password',
                        inputType: 'password',
                        onChange: (e) => onChange(e, 'confirmNewPassword'),
                    }}
                    validateProps={{
                        inputs,
                        input: inputs.confirmNewPassword,
                        showInputMessagesFromOutside: areValid,
                    }}
                />
            </Form>
        );
    }

    function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        name: keyof typeof inputs,
    ) {
        setInputs((prev) => ({
            ...prev,
            [name]: { ...prev[name], value: e.target.value },
        }));
    }

    function setShowInputsMessage(value: boolean) {
        setAreValid(value);
    }

    async function onSubmitInputs() {
        const action = process.env.NEXT_PUBLIC_CHANGE_PASSWORD_LINK as string;
        const handledBody = {
            username: { value: user.username },
            ...omitFields(inputs, ['errors', 'required', 'validations']),
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

const INPUTS_INITIAL_STATE: InputsToValidateType<
    'password' | 'newPassword' | 'confirmNewPassword'
> = {
    password: {
        validations: (currentInputValue) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password incorrect',
            },
        ],
        required: 'Password incorrect',
        value: '',
        errors: [],
    },
    newPassword: {
        validations: (currentInputValue, hookInputs) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password must has 6 characters at least',
            },
            {
                coditional: currentInputValue === hookInputs?.password.value,
                message: 'This field have to be different than the password',
            },
            {
                coditional: currentInputValue !== hookInputs?.password.value,
                message:
                    'This field has to be equal to the confirm new password',
            },
        ],
        required: 'New password incorrect',
        value: '',
        errors: [],
    },
    confirmNewPassword: {
        validations: (currentInputValue, hookInputs) => [
            {
                coditional: currentInputValue !== hookInputs?.password.value,
                message: 'This field has to be equal to the new password',
            },
        ],
        required: 'Confirm new password incorrect',
        value: '',
        errors: [],
    },
};
