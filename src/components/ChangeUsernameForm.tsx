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

    return <>{renderContent()}</>;

    function renderContent() {
        if (
            user.username === (process.env.NEXT_PUBLIC_ADMIN_USERNAME as string)
        )
            return null;

        return (
            <InputsHandler preInputs={preInputs}>
                <Form legend="Change Username" onSubmitInputs={onSubmitInputs}>
                    <Input
                        label="New Username"
                        inputType="text"
                        objectifiedName="newUsername"
                        targetProps={['value']}
                    />
                </Form>
            </InputsHandler>
        );
    }

    async function onSubmitInputs(inputs: HandledInputs<typeof preInputs>) {
        const action = process.env.NEXT_PUBLIC_CHANGE_USERNAME_LINK as string;
        const handledBody = { username: { value: user.username }, ...inputs };
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledBody),
        };
        const response = await fetch(action, options);
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

const preInputs = {
    newUsername: {
        validations: (currentInputValue: string) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Incorrect username',
            },
        ],
        required: 'Incorrect username',
    },
};
