import Form from './Form';
import Input from './Input';
import InputsHandler from './InputsHandler';
import { useRouter } from 'next/router';

type ChangePasswordFormPropsTypes = HandlerUserStateProps;

export default function ChangePasswordForm({
    user,
    setUser,
}: ChangePasswordFormPropsTypes) {
    const router = useRouter();

    return (
        <InputsHandler preInputs={preInputs}>
            <Form legend="Change Username" onSubmitInputs={onSubmitInputs}>
                <Input
                    label="New Username"
                    inputType="password"
                    fieldName="newUsername"
                />
            </Form>
        </InputsHandler>
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
            return;
        }
        setUser(parsedResponse.serverResponse);
        router.reload();
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
