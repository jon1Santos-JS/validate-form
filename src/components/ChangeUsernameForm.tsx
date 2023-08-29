import { InputsHandledContext } from '@/context/InputsHandlerContext';
import Form from './Form';
import Input from './Input';
import { useRouter } from 'next/router';
import { useContext } from 'react';

type ChangePasswordFormPropsTypes = HandlerUserStateProps;

export default function ChangePasswordForm({
    user,
    setUser,
}: ChangePasswordFormPropsTypes) {
    const router = useRouter();
    const { onChangeInput } = useContext(InputsHandledContext);

    return <>{renderContent()}</>;

    function renderContent() {
        if (
            user.username === (process.env.NEXT_PUBLIC_ADMIN_USERNAME as string)
        )
            return null;

        return (
            <Form legend="Change Username" onSubmitInputs={onSubmitInputs}>
                <Input
                    label="New Username"
                    inputType="text"
                    onChange={onChangeUsername}
                    objectifiedName="newUsername"
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

        onChangeInput({
            objectifiedName: 'newUsername',
            targetProp: 'clientTop',
            value: e.target.clientTop,
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
