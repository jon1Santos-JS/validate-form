import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Input from './Input';
import useValidate from '@/hooks/useValidate';
import { useAuth } from '../context/UserContext';
import useInputHandler from '@/hooks/useInputHandler';
import useUtils from '@/hooks/useUtils';
import { useRouter } from 'next/router';
const UPDATE_USERNAME_API = 'api/updateUsername';
const CHECK_USERNAME_API = 'api/checkUsername';

type InputsType = 'newUsername' | 'password';

type ChangeUsernameProps = {
    isRequesting: boolean;
    setRequestState: Dispatch<SetStateAction<boolean>>;
};

export default function ChangeUsernameForm({
    isRequesting,
    setRequestState,
}: ChangeUsernameProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { validateSingleSync, validateMany } = useValidate();
    const { inputsFactory, onCheckUsername } = useInputHandler();
    const { onSetTimeOut } = useUtils();
    const [inputState, setInputState] = useState({
        newUsername: { showInputMessage: false, highlightInput: false },
        password: { showInputMessage: false, highlightInput: false },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        newUsername: inputsFactory({
            validations: async ({ value }) => [
                {
                    conditional: await onCheckUsername(CHECK_USERNAME_API, {
                        method: 'POST',
                        body: value,
                    }),
                    message: 'Username already exist',
                },
            ],
            validationsSync: ({ value }) => [
                {
                    conditional: !value.match(/.{6,}/),
                    message: 'Username must has 6 characters at least',
                },
                {
                    conditional: !value.match(/^[A-Za-z]*$/),
                    message: 'Do not use special characters or numbers',
                },
            ],
            required: { value: true },
            attributes: { value: '' },
            errors: [],
        }),
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
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            onHilightInputs(false);
            onSetRequestErrorMessage('password');
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
            <form className="o-change-username-form">
                <fieldset className="container">
                    <h3 className="legend">
                        <legend>Change Username</legend>
                    </h3>
                    <div className="inputs">
                        <Input
                            ownProps={{
                                label: 'New Username',
                                inputType: 'text',
                                onChange: (e) => onChange(e, 'newUsername'),
                                className: `${
                                    isRequesting ? 'is-input-disabled' : ''
                                }`,
                            }}
                            inputStateProps={{
                                input: inputs.newUsername,
                                inputState: inputState.newUsername,
                            }}
                        />
                        <Input
                            ownProps={{
                                label: 'Password',
                                inputType: 'password',
                                onChange: (e) => onChangePassword(e),
                                className: `${
                                    isRequesting ? 'is-input-disabled' : ''
                                }`,
                            }}
                            inputStateProps={{
                                input: inputs.password,
                                inputState: inputState.password,
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

    async function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        key: InputsType,
    ) {
        if (isRequesting) return;
        setInputs((prev) => ({
            ...prev,
            [key]: { ...prev[key], attributes: { value: e.target.value } },
        }));
        onSetTimeOut(() => {
            const validatedInput = validateSingleSync({
                ...inputs[key],
                attributes: { value: e.target.value },
            });
            setInputs((prev) => ({ ...prev, [key]: validatedInput }));
        }, 950);
    }

    function onChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
        if (isRequesting) return;
        setInputs((prev) => ({
            ...prev,
            password: {
                ...prev.password,
                attributes: { value: e.target.value },
            },
        }));
        onSetTimeOut(() => {
            setInputs((prev) => ({
                ...prev,
                password: validateSingleSync({
                    ...prev.password,
                    attributes: { value: e.target.value },
                }),
            }));
        }, 950);
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (isRequesting) return;
        if (areErrorsUp()) return;
        setRequestState(true);
        if (!(await validateMany(inputs))) {
            onHilightInputs(true);
            onShowInputsMessages(true);
            setRequestState(false);
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
        const { newUsername, password } = inputsToHandle;
        return {
            username: { value: username },
            newUsername: { value: newUsername.attributes.value },
            password: { value: password.attributes.value },
        };
    }

    async function onSubmitInputs(handledInputs: UserWithNewUsername) {
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledInputs),
        };
        const response = await fetch(UPDATE_USERNAME_API, options);
        const parsedResponse: DBDefaultResponse = await response.json();
        if (!parsedResponse.success) {
            onHandleRequestErrorMessage(parsedResponse.data);
            onHilightInputs(true, 'password');
            onShowInputsMessages(true, 'password');
            return;
        }
        onHilightInputs(false, 'password');
        onShowInputsMessages(false, 'password');
        onSetRequestErrorMessage('password');
        router.reload();
    }

    function onHandleRequestErrorMessage(message: string) {
        if (message.toLowerCase().includes('account'))
            onSetRequestErrorMessage('password', 'Incorrect password');
    }

    function onSetRequestErrorMessage(key: InputsType, message?: string) {
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
                newUsername: {
                    ...prev.newUsername,
                    highlightInput: value,
                },
                password: {
                    ...prev.password,
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
                newUsername: {
                    ...prev.newUsername,
                    showInputMessage: value,
                },
                password: {
                    ...prev.password,
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
