import { useState } from 'react';
import Form from './Form';
import Input from './Input';
import InputsHandler from './InputsHandler';
import { useRouter } from 'next/router';

type ChangePasswordFormPropsTypes = HandlerUserStateProps;

export default function ChangePasswordForm({
    user,
    setUser,
}: ChangePasswordFormPropsTypes) {
    const [alternativeErrors, setAlternativeErrors] = useState<string[]>([]);
    const router = useRouter();

    return (
        <>
            <InputsHandler preInputs={preInputs}>
                <Form legend="Change Username" onSubmitInputs={onSubmitInputs}>
                    <Input
                        label="New Username"
                        inputType="password"
                        fieldName="newUsername"
                        alternativeErrors={...alternativeErrors}
                    />
                </Form>
            </InputsHandler>
        </>
    );

    async function onSubmitInputs<T>(formContent: T) {
        const action = process.env.NEXT_PUBLIC_CHANGE_USERNAME_LINK as string;
        const handledBody = { username: { value: user }, ...formContent };
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledBody),
        };
        const response = await fetch(action, options);
        const parsedResponse: ServerResponse = await response.json();
        if (typeof parsedResponse.serverResponse !== 'string') {
            setAlternativeErrors(['This username is already used']);
            return;
        }
        const value: string = parsedResponse.serverResponse;
        setAlternativeErrors([]);
        router.reload();
        window.addEventListener('load', () => {
            setUser(value);
        });
    }
}

const preInputs: PreFormInputsType = {
    newUsername: {
        validations: (currentInputValue) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Username incorrect',
            },
        ],
        required: 'Username incorrect',
    },
};
