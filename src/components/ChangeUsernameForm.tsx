import { useState } from 'react';
import Form from './Form';
import Input from './Input';
import { useRouter } from 'next/router';
const API = 'api/changeUsername';

const DEFAULT_ERROR_MESSAGE = 'Invalid username';

type OwnPropsType = {
    ownProps: ChangeUsernameFormPropsTypes;
};

type ChangeUsernameFormPropsTypes = {
    handleUserProps: HandleUserPropsType;
};

export default function ChangeUsernameForm({
    ownProps: { handleUserProps },
}: OwnPropsType) {
    const router = useRouter();
    const { user, setUser } = handleUserProps;
    const [areValid, setAreValid] = useState(false);
    const [inputs, setInputs] = useState({
        newUsername: {
            validations: (currentInputValue: string) => [
                {
                    coditional: !currentInputValue.match(/.{6,}/),
                },
            ],
            required: true,
            value: '',
            errors: [],
        },
    });

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
                    legend: 'Change Username',
                    onSubmitInputs: onSubmitInputs,
                    formError: DEFAULT_ERROR_MESSAGE,
                    waitMessageToSubmit: true,
                }}
                validateProps={{ inputs, setShowInputsMessage }}
            >
                <Input
                    ownProps={{
                        label: 'New Username',
                        inputType: 'text',
                        onChange: (e) => onChange(e, 'newUsername'),
                    }}
                    validateProps={{
                        inputs,
                        input: inputs.newUsername,
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
        const handledBody = {
            username: { value: user.username },
            newUsername: { value: inputs.newUsername.value },
        };
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledBody),
        };
        const response = await fetch(API, options);
        const parsedResponse: ServerResponse = await response.json();
        if (!parsedResponse.serverResponse) {
            return parsedResponse.body as string;
        }
        router.reload();
        window.addEventListener('load', () => {
            setUser({ username: parsedResponse.body as string });
        });
    }
}
