import { useState } from 'react';
import Form from './Form';
import Input from './Input';
import { useRouter } from 'next/router';
import { omitFields, preventCompareEmptyField } from '@/hooks/useInputsHandler';

const API = 'api/changePassword';
const FIELDS_TO_OMIT: (keyof ValidateInputType<string>)[] = [
    'errors',
    'required',
    'validations',
];

type ChangePasswordFormPropsTypes = {
    handleUserProps: HandleUserPropsType;
};

type InputsType = 'password' | 'newPassword' | 'confirmNewPassword';

export default function ChangePasswordForm({
    handleUserProps,
}: ChangePasswordFormPropsTypes) {
    const router = useRouter();
    const { user } = handleUserProps;
    const [ShowInputsMessage, setShowInputsMessage] = useState(false);
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
                    onShowInputsMessage,
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
                        showInputMessagesFromOutside: ShowInputsMessage,
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
                        showInputMessagesFromOutside: ShowInputsMessage,
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
                        showInputMessagesFromOutside: ShowInputsMessage,
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

    function onShowInputsMessage(value: boolean) {
        setShowInputsMessage(value);
    }

    async function onSubmitInputs() {
        const handledBody = {
            username: { value: user.username },
            ...omitFields(inputs, FIELDS_TO_OMIT),
        };
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledBody),
        };
        const response = await fetch(API, options);
        const parsedResponse: ServerResponse = await response.json();
        if (!parsedResponse.serverResponse) return;
        router.reload();
    }
}

const INPUTS_INITIAL_STATE: InputsToValidateType<InputsType> = {
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
                coditional: preventCompareEmptyField(
                    hookInputs?.confirmNewPassword.value,
                    currentInputValue !== hookInputs?.confirmNewPassword.value,
                ),
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
                coditional: currentInputValue !== hookInputs?.newPassword.value,
                message: 'This field has to be equal to the new password',
            },
        ],
        required: 'Confirm new password incorrect',
        value: '',
        errors: [],
    },
};
