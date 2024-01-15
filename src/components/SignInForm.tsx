import { useState } from 'react';
import Input from './Input';
import useInputHandler from '@/hooks/useInputHandler';
import Link from 'next/link';
import useValidate from '@/hooks/useValidate';
import { useAuth } from '../context/UserContext';
import useUtils from '@/hooks/useUtils';

const API = 'api/signIn';
const DEFAULT_MESSAGE = 'Incorrect username or password';

type InputsType = 'username' | 'password';

export default function SignInForm() {
    const {
        userState: { hasUser },
        setUserState,
    } = useAuth();
    const { validateSingleSync, validateManySync } = useValidate();
    const { inputsFactory } = useInputHandler();
    const { onSetTimeOut } = useUtils();
    const [showMessage, onShowMessage] = useState<boolean>(false);
    const [isRequesting, setRequestState] = useState(false);
    const [inputState, setInputState] = useState({
        username: { showInputMessage: false, highlightInput: false },
        password: { showInputMessage: false, highlightInput: false },
    });

    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        username: inputsFactory({
            validationsSync: ({ value }) => [
                {
                    conditional: !value,
                    message: '',
                },
                {
                    conditional: !value.match(/.{6,}/),
                    message: '',
                },
                {
                    conditional: !value.match(/^[A-Za-z]*$/),
                    message: '',
                },
            ],
            required: { value: true },
            attributes: { value: '' },
            errors: [],
        }),
        password: inputsFactory({
            validationsSync: ({ value }) => [
                {
                    conditional: !value,
                    message: '',
                },
                {
                    conditional: !value.match(/.{6,}/),
                    message: '',
                },
            ],
            required: { value: true },
            attributes: { value: '' },
            errors: [],
        }),
    });

    return (
        <form className="o-sign-in-form">
            <fieldset className="container">
                <div className="legend">
                    <legend>Sign in</legend>
                </div>
                <div className="inputs">
                    <Input
                        ownProps={{
                            label: 'Username',
                            inputType: 'text',
                            onChange: (e) => onChange(e, 'username'),
                            className: `${
                                isRequesting ? 'is-input-disabled' : ''
                            }`,
                        }}
                        inputStateProps={{
                            input: inputs.username,
                            inputState: inputState.username,
                        }}
                    />
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
                </div>
                {renderError()}
                <div className="buttons">
                    <button
                        key={'submitButton'}
                        className="c-button button"
                        onClick={onClick}
                    >
                        Submit
                    </button>
                    {!hasUser && (
                        <Link href="/sign-up-page">
                            <button className="c-button button">Sign up</button>
                        </Link>
                    )}
                </div>
            </fieldset>
        </form>
    );

    function onChange(e: React.ChangeEvent<HTMLInputElement>, key: InputsType) {
        if (isRequesting) return;
        setInputs((prev) => ({
            ...prev,
            [key]: { ...prev[key], attributes: { value: e.target.value } },
        }));
        setInputs((prev) => ({
            ...prev,
            [key]: validateSingleSync({ ...prev[key] }),
        }));
    }

    function renderError() {
        return (
            <div className="l-text--danger form-error">
                {showMessage ? DEFAULT_MESSAGE : null}
            </div>
        );
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (showMessage) return;
        if (isRequesting) return;
        if (!validateManySync(inputs)) {
            onShowMessage(true);
            onHilightInputs(true);
            onSetTimeOut(() => {
                onShowMessage(false);
                onHilightInputs(false);
            }, 2750);
            onShowInputsMessages(true);
            return;
        }
        const handledInputs = onHandleInputs(inputs);
        setRequestState(true);
        await onSubmitInputs(handledInputs);
        setRequestState(false);
    }

    function onHandleInputs(inputsTohandle: InputsToValidateType<InputsType>) {
        const { username, password } = inputsTohandle;
        return {
            username: { value: username.attributes.value },
            password: { value: password.attributes.value },
        };
    }

    async function onSubmitInputs(handledInput: UserFromClient) {
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledInput),
        };
        const response = await fetch(API, options);
        const parsedResponse: DBDefaultResponse = await response.json();
        setUserState((prev) => ({ ...prev, isUserStateLoading: false }));
        setUserState((prev) => ({ ...prev, hasUser: parsedResponse.success }));
        if (!parsedResponse.success) {
            onSetRequestErrorMessage(null, '');
            onShowMessage(true);
            onHilightInputs(true);
            onSetTimeOut(() => {
                onShowMessage(false);
                onHilightInputs(false);
            }, 2750);
            return;
        }
    }

    function onHilightInputs(value: boolean) {
        setInputState((prev) => ({
            ...prev,
            username: {
                ...prev.username,
                highlightInput: value,
            },
            password: {
                ...prev.password,
                highlightInput: value,
            },
        }));
    }

    function onShowInputsMessages(value: boolean) {
        setInputState((prev) => ({
            ...prev,
            username: {
                ...prev.username,
                showInputMessage: value,
            },
            password: {
                ...prev.password,
                showInputMessage: value,
            },
        }));
    }

    function onSetRequestErrorMessage(
        key?: InputsType | null,
        message: string | null = '',
    ) {
        if (!key && message === null) {
            setInputs((prev) => {
                for (const i in prev) {
                    prev[i as InputsType].requestErrors = [];
                }
                return prev;
            });
            return;
        }
        if (!key && message !== null) {
            setInputs((prev) => {
                for (const i in prev) {
                    prev[i as InputsType].requestErrors = [message];
                }
                return prev;
            });
            return;
        }
        if (key && message === null) {
            setInputs((prev) => ({
                ...prev,
                [key]: { ...prev[key], requestErrors: [] },
            }));
            return;
        }
        if (key && message !== null) {
            setInputs((prev) => ({
                ...prev,
                [key]: { ...prev[key], requestErrors: [message] },
            }));
        }
    }
}
