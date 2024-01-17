import Input from './Input';
import { useRouter } from 'next/router';
import useValidate from '@/hooks/useValidate';
import useInputHandler from '@/hooks/useInputHandler';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAuth } from '../context/UserContext';
import useUtils from '@/hooks/useUtils';

const API = 'api/updatePassword';

type InputsType = 'password' | 'newPassword' | 'confirmNewPassword';

type ChangePasswordProps = {
    isRequesting: boolean;
    setRequestState: Dispatch<SetStateAction<boolean>>;
};

export default function ChangePasswordForm({
    isRequesting,
    setRequestState,
}: ChangePasswordProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { validateSingleSync, validateManySync } = useValidate();
    const { inputsFactory } = useInputHandler();
    const { onSetTimeOut } = useUtils();
    const [inputState, setInputState] = useState({
        password: { showInputMessage: false, highlightInput: false },
        newPassword: { showInputMessage: false, highlightInput: false },
        confirmNewPassword: { showInputMessage: false, highlightInput: false },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        password: inputsFactory({
            validationsSync: ({ value }) => [
                {
                    conditional: !value.match(/.{6,}/),
                    message: 'Incorrect Password',
                },
            ],
            required: { value: true },
            attributes: { value: '' },
            errors: [],
            requestErrors: [],
        }),
        newPassword: inputsFactory({
            validationsSync: ({ value }, currentInputs) => [
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
            required: { value: true },
            attributes: { value: '' },
            errors: [],
        }),
        confirmNewPassword: inputsFactory({
            validationsSync: ({ value }, currentInputs) => [
                {
                    conditional:
                        value !== currentInputs?.newPassword.attributes.value,
                    message: 'This field has to be equal to the new password',
                },
            ],
            crossfields: ['newPassword'],
            required: { value: true },
            attributes: { value: '' },
            errors: [],
        }),
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            onHilightInputs(false);
            onShowInputsMessages(false);
        }, 2750);
        return () => clearTimeout(timeout);
    }, [inputState]);

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
                                className: `${
                                    isRequesting ? 'is-input-disabled' : ''
                                }`,
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
                                className: `${
                                    isRequesting ? 'is-input-disabled' : ''
                                }`,
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
                                className: `${
                                    isRequesting ? 'is-input-disabled' : ''
                                }`,
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
                            className="c-button button"
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
        if (isRequesting) return;
        setInputs((prev) => ({
            ...prev,
            [key]: { ...prev[key], attributes: { value: e.target.value } },
        }));
        onSetTimeOut(() => {
            setInputs((prev) => ({
                ...prev,
                [key]: validateSingleSync({ ...prev[key] }, prev),
            }));
        }, 950);
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (isRequesting) return;
        if (areErrorsUp()) return;
        if (!validateManySync(inputs)) {
            onHilightInputs(true);
            onShowInputsMessages(true);
            return;
        }
        const handledInputs = onHandleInputs(inputs, user.username);
        setRequestState(true);
        await onSubmitInputs(handledInputs);
        setRequestState(false);
    }

    function areErrorsUp() {
        let isValid = false;
        for (const i in inputState) {
            if (inputState[i as InputsType].showInputMessage) isValid = true;
        }
        return isValid;
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

    async function onSubmitInputs(handledInputs: UserWithNewPassword) {
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledInputs),
        };
        const response = await fetch(API, options);
        const parsedResponse: DBDefaultResponse = await response.json();
        if (!parsedResponse.success) {
            onSetRequestMessage('password', parsedResponse.data);
            onHilightInputs(true);
            onShowInputsMessages(true);
            return;
        }
        onSetRequestMessage('password');
        router.reload();
    }

    function onSetRequestMessage(key: InputsType, message?: string) {
        if (!message) {
            setInputs((prev) => ({
                ...prev,
                [key]: { ...prev[key], requestErrors: [] },
            }));
            return;
        }
        setInputs((prev) => ({
            ...prev,
            [key]: { ...prev[key], requestErrors: [message] },
        }));
    }

    function onHilightInputs(value: boolean, key?: InputsType) {
        if (!key) {
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
            return;
        }
        setInputState((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                highlightInput: value,
            },
        }));
    }

    function onShowInputsMessages(value: boolean, key?: InputsType) {
        if (!key) {
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
            return;
        }
        setInputState((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                showInputMessage: value,
            },
        }));
    }
}
