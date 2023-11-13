import Input from './Input';
import { useRouter } from 'next/router';
import useValidate from '@/hooks/useValidate';
import useInputHandler from '@/hooks/useInputHandler';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import useUtils from '@/hooks/useUtils';

const API = 'api/updatePassword';

type InputsType = 'password' | 'newPassword' | 'confirmNewPassword';

export default function ChangePasswordForm() {
    const router = useRouter();
    const { user } = useUser();
    const { validateSingle, validateMany } = useValidate();
    const { inputsFactory } = useInputHandler();
    const { onSetTimeOut } = useUtils();
    const [isClickable, handleButtonClick] = useState(true);
    const [inputState, setInputState] = useState({
        password: { showInputMessage: false, highlightInput: false },
        newPassword: { showInputMessage: false, highlightInput: false },
        confirmNewPassword: { showInputMessage: false, highlightInput: false },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        password: inputsFactory({
            validations: ({ value }) => [
                {
                    conditional: !value.match(/.{6,}/),
                    message: 'Incorrect Password',
                },
            ],
            required: true,
            attributes: { value: '' },
            errors: [],
        }),
        newPassword: inputsFactory({
            validations: ({ value }, currentInputs) => [
                {
                    conditional: !value.match(/.{6,}/),
                    message: 'Password must has 6 characters at least',
                },
                {
                    conditional:
                        value === currentInputs?.password.attributes.value,
                    message:
                        'This field have to be different than the password',
                },
                {
                    conditional:
                        value !==
                        currentInputs?.confirmNewPassword.attributes.value,
                    message:
                        'This field has to be equal to the confirm new password',
                },
            ],
            crossfields: ['password', 'confirmNewPassword'],
            required: true,
            attributes: { value: '' },
            errors: [],
        }),
        confirmNewPassword: inputsFactory({
            validations: ({ value }, currentInputs) => [
                {
                    conditional:
                        value !== currentInputs?.newPassword.attributes.value,
                    message: 'This field has to be equal to the new password',
                },
            ],
            crossfields: ['newPassword'],
            required: true,
            attributes: { value: '' },
            errors: [],
        }),
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

    function onChange(e: React.ChangeEvent<HTMLInputElement>, key: InputsType) {
        handleButtonClick(false);
        setInputs((prev) => ({
            ...prev,
            [key]: { ...prev[key], attributes: { value: e.target.value } },
        }));
        onSetTimeOut(() => {
            setInputs((prev) => ({
                ...prev,
                [key]: validateSingle({ ...prev[key] }, prev),
            }));
            handleButtonClick(true);
        }, 950);
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (!isClickable) return;
        if (!validateMany(inputs)) {
            onHilightInputs(true);
            onShowInputsMessages(true);
            return;
        }
        const handledInputs = onHandleInputs(inputs, user.username);
        handleButtonClick(false);
        const response = await onSubmitInputs(handledInputs);
        handleButtonClick(() => {
            onHandleResponse(response);
            return true;
        });
    }

    function onHandleInputs(
        inputsToHandle: InputsToValidateType<InputsType>,
        username: string,
    ) {
        const { password, newPassword } = inputsToHandle;
        return {
            username: { value: username },
            password: { value: password.attributes.value },
            newPassword: { value: newPassword.attributes.value },
        };
    }

    function onHandleResponse(response: DBDefaultResponse) {
        if (!response.success) {
            onHilightInputs(true);
            onShowInputsMessages(true);
            return;
        }
        router.reload();
    }

    async function onSubmitInputs(handledInputs: UserWithNewPassword) {
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledInputs),
        };
        const response = await fetch(API, options);
        const parsedResponse: DBDefaultResponse = await response.json();
        return parsedResponse;
    }

    function onHilightInputs(value: boolean) {
        setInputState((prev) => ({
            ...prev,
            password: {
                ...prev.password,
                highlightInput: value,
            },
            newPassword: {
                ...prev.password,
                highlightInput: value,
            },
            confirmNewPassword: {
                ...prev.confirmNewPassword,
                highlightInput: value,
            },
        }));
    }

    function onShowInputsMessages(value: boolean) {
        setInputState((prev) => ({
            ...prev,
            password: {
                ...prev.password,
                showInputMessage: value,
            },
            newPassword: {
                ...prev.newPassword,
                showInputMessage: value,
            },
            confirmNewPassword: {
                ...prev.confirmNewPassword,
                showInputMessage: value,
            },
        }));
    }
}
