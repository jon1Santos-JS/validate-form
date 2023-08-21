import InputsHandlerContext from '@/context/InputsHandlerContext';
import Form from './Form';
import Input from './Input';
import { useRouter } from 'next/router';
import { useContext } from 'react';

type ChangePasswordFormPropsTypes = HandlerUserStateProps;

export default function ChangePasswordForm({
    user,
}: ChangePasswordFormPropsTypes) {
    const router = useRouter();
    const { onChangeInput } = useContext(InputsHandlerContext);

    return <>{renderContent()}</>;

    function renderContent() {
        if (
            user.username === (process.env.NEXT_PUBLIC_ADMIN_USERNAME as string)
        )
            return null;

        return (
            <Form legend="Change Password" onSubmitInputs={onSubmitInputs}>
                <Input
                    label="Password"
                    inputType="password"
                    onChange={onchangePassword}
                    objectifiedName="password"
                />
                <Input
                    label="New Password"
                    inputType="password"
                    onChange={onchangeNewPassword}
                    objectifiedName="newPassword"
                />
                <Input
                    label="Confirm New Password"
                    inputType="password"
                    onChange={onchangeConfirmNewPassword}
                    objectifiedName="confirmNewPassword"
                />
            </Form>
        );
    }

    function onchangePassword(e: React.ChangeEvent<HTMLInputElement>) {
        onChangeInput({
            objectifiedName: 'password',
            targetProp: 'value',
            value: e.target.value,
        });
    }

    function onchangeNewPassword(e: React.ChangeEvent<HTMLInputElement>) {
        onChangeInput({
            objectifiedName: 'newPassword',
            targetProp: 'value',
            value: e.target.value,
        });
    }

    function onchangeConfirmNewPassword(
        e: React.ChangeEvent<HTMLInputElement>,
    ) {
        onChangeInput({
            objectifiedName: 'confirmNewPassword',
            targetProp: 'value',
            value: e.target.value,
        });
    }

    async function onSubmitInputs(
        handledInputs: FormInputsTypeToSubmit<
            keyof typeof CHANGE_PASSWORD_FORM_INPUTS_STATE
        >,
    ) {
        const action = process.env.NEXT_PUBLIC_CHANGE_PASSWORD_LINK as string;
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
        if (!parsedResponse.serverResponse) return;
        router.reload();
    }
}

export const CHANGE_PASSWORD_FORM_INPUTS_STATE = {
    password: {
        validations: (currentInputValue: string) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password incorrect',
            },
        ],
        required: 'Password incorrect',
    },
    newPassword: {
        validations<T>: (
            currentInputValue: string,
            formInputs: PreFormInputsType<T>,
        ) => [
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
        validations: (
            currentInputValue: string,
            formInputs: PreFormInputsType,
        ) => [
            {
                coditional:
                    currentInputValue !== formInputs['newPassword'].value,
                message: 'This field has to be equal to the new password',
            },
        ],
        required: 'Confirm new password incorrect',
    },
};
