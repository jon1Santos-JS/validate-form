import Input from './Input';
import { useRouter } from 'next/router';
import useValidate from '@/hooks/useValidate';
import useInputHandler, { FIELDS_TO_OMIT } from '@/hooks/useInputHandler';
import { useState } from 'react';

const API = 'api/changePassword';

type ChangePasswordFormPropsTypes = {
    handleUserProps: HandleUserPropsType;
};

type InputsType = 'password' | 'newPassword' | 'confirmNewPassword';

export default function ChangePasswordForm({
    handleUserProps,
}: ChangePasswordFormPropsTypes) {
    const router = useRouter();
    const { user } = handleUserProps;
    const [showMessage, onShowMessage] = useState<boolean>(false);
    const { uniqueValidation, manyValidation } = useValidate();
    const { omitFields, onHighlightManyInputs } = useInputHandler();
    const [isButtonClickable, setClickableButton] = useState(true);
    const [inputState, setInputState] = useState({
        password: {
            showInputMessage: false,
            highlightInput: false,
            onShowInputMessage: onShowInputMessage,
            onHighlightInput: onHighlightInput,
        },
        newPassword: {
            showInputMessage: false,
            highlightInput: false,
            onShowInputMessage: onShowInputMessage,
            onHighlightInput: onHighlightInput,
        },
        confirmNewPassword: {
            showInputMessage: false,
            highlightInput: false,
            onShowInputMessage: onShowInputMessage,
            onHighlightInput: onHighlightInput,
        },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        password: {
            validations: (currentInputValue) => [
                {
                    coditional: !currentInputValue.match(/.{6,}/),
                    message: 'Password incorrect',
                },
            ],
            required: true,
            value: '',
            errors: [],
        },
        newPassword: {
            validations: (currentInputValue, inputs) => [
                {
                    coditional: !currentInputValue.match(/.{6,}/),
                    message: 'Password must has 6 characters at least',
                },
                {
                    coditional: currentInputValue === inputs?.password.value,
                    message:
                        'This field have to be different than the password',
                },
                {
                    coditional:
                        currentInputValue !== inputs?.confirmNewPassword.value,
                    message:
                        'This field has to be equal to the confirm new password',
                },
            ],
            required: true,
            value: '',
            errors: [],
        },
        confirmNewPassword: {
            validations: (currentInputValue, hookInputs) => [
                {
                    coditional:
                        currentInputValue !== hookInputs?.newPassword.value,
                    message: 'This field has to be equal to the new password',
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
            <form className="o-change-password-form">
                <fieldset className="container">
                    <div className="legend">
                        <legend>Change Password</legend>
                    </div>
                    <div className="inputs">
                        <Input
                            ownProps={{
                                label: 'Password',
                                inputType: 'password',
                                onChange: (e) => onChange(e, 'password'),
                            }}
                            inputStateProps={{
                                input: inputs.password,
                                inputState: inputState.password,
                            }}
                            formProps={{
                                hasError: false,
                            }}
                        />
                        <Input
                            ownProps={{
                                label: 'New Password',
                                inputType: 'password',
                                onChange: (e) => onChange(e, 'newPassword'),
                            }}
                            inputStateProps={{
                                input: inputs.newPassword,
                                inputState: inputState.newPassword,
                            }}
                            formProps={{
                                hasError: false,
                            }}
                        />
                        <Input
                            ownProps={{
                                label: 'Confirm New Password',
                                inputType: 'password',
                                onChange: (e) =>
                                    onChange(e, 'confirmNewPassword'),
                            }}
                            inputStateProps={{
                                input: inputs.confirmNewPassword,
                                inputState: inputState.confirmNewPassword,
                            }}
                            formProps={{
                                hasError: false,
                            }}
                        />
                    </div>
                    <div>
                        <button
                            key={'submitButton'}
                            className="c-button"
                            onClick={onClick}
                        >
                            Submit
                        </button>
                    </div>
                </fieldset>
            </form>
        );
    }

    function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        key: keyof typeof inputs,
    ) {
        setInputs((prev) => ({
            ...prev,
            [key]: { ...prev[key], value: e.target.value },
        }));
        setInputs((prev) => ({
            ...prev,
            [key]: uniqueValidation({ ...prev[key] }),
        }));
    }

    function onShowInputMessage(value: boolean, key: InputsType) {
        setInputState((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                showInputMessage: value,
            },
        }));
    }

    function onHighlightInput(value: boolean, key: InputsType) {
        setInputState((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                highlightInput: value,
            },
        }));
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (showMessage) return; // WAITING THE MESSAGE GOES DOWN TO REQUEST
        if (manyValidation(inputs)) {
            if (!isButtonClickable) return;
            setClickableButton(false);
            await onSubmitInputs();
        }
        onHighlightManyInputs(inputState, true, 2);
        onShowMessage(true);
        setClickableButton(true);
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
        onHighlightManyInputs(inputState, true, 2);
        onShowMessage(false);
        router.reload();
    }
}
