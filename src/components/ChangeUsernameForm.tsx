import Form from './Form';
import Input from './Input';
import { useRouter } from 'next/router';

type ChangePasswordFormPropsTypes = {
    handleUserProps: HandleUserPropsType;
    handleInputsProps: HandleInputsPropsType<'newUsername'>;
};

export default function ChangePasswordForm({
    handleUserProps,
    handleInputsProps,
}: ChangePasswordFormPropsTypes) {
    const router = useRouter();
    const { user, setUser } = handleUserProps;
    const { onChangeInput } = handleInputsProps;

    return <>{renderContent()}</>;

    function renderContent() {
        if (
            user.username === (process.env.NEXT_PUBLIC_ADMIN_USERNAME as string)
        )
            return null;

        return (
            <Form
                props={{
                    legend: 'Change Username',
                    onSubmitInputs: onSubmitInputs,
                }}
                handleInputsProps={handleInputsProps}
            >
                <Input
                    props={{
                        label: 'New Username',
                        inputType: 'text',
                        onChange: onChangeUsername,
                        objectifiedName: 'newUsername',
                    }}
                    handleInputsProps={handleInputsProps}
                />
            </Form>
        );
    }

    function onChangeUsername(e: React.ChangeEvent<HTMLInputElement>) {
        onChangeInput({
            objectifiedName: 'newUsername',
            targetProp: 'value',
            value: e.target.value,
        });
    }

    async function onSubmitInputs(
        handledInputs: FormHandledInputsType<
            keyof typeof CHANGE_USERNAME_FORM_INPUTS_STATE
        >,
    ) {
        const action = process.env.NEXT_PUBLIC_CHANGE_USERNAME_LINK as string;
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
        if (!parsedResponse.serverResponse) {
            return parsedResponse.body as string;
        }
        router.reload();
        window.addEventListener('load', () => {
            setUser({ username: parsedResponse.body as string });
        });
    }
}

export const CHANGE_USERNAME_FORM_INPUTS_STATE: PreFormInputsType<'newUsername'> =
    {
        newUsername: {
            validations: (currentInputValue) => [
                {
                    coditional: !currentInputValue.match(/.{6,}/),
                    message: 'Incorrect username',
                },
            ],
            required: 'Incorrect username',
        },
    };
