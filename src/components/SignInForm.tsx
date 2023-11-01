import { useState } from 'react';
import Input from './Input';
import useInputHandler, { FIELDS_TO_OMIT } from '@/hooks/useInputHandler';
import Link from 'next/link';
import useValidate from '@/hooks/useValidate';
import { useUser } from '../context/UserContext';

const API = 'api/signIn';
const DEFAULT_MESSAGE = 'Incorrect username or password';

type InputsType = 'username' | 'password';

export default function SignInForm() {
    const {
        user,
        userState: { setHasUser, hasUser, setUserStateLoading },
    } = useUser();
    const { validateSingle, validateMany } = useValidate();
    const { omitFields, onSetTimeOut, inputsFactory } = useInputHandler();
    const [showMessage, onShowMessage] = useState<boolean>(false);
    const [isClickable, handleButtonClick] = useState(true);
    const [inputState, setInputState] = useState({
        username: { showInputMessage: false, highlightInput: false },
        password: { showInputMessage: false, highlightInput: false },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        username: inputsFactory({
            validations: (currentInputValue) => [
                {
                    conditional: !currentInputValue,
                    message: '',
                },
                {
                    conditional: !currentInputValue.match(/.{6,}/),
                    message: '',
                },
                {
                    conditional: !currentInputValue.match(/^[A-Za-z]+$/),
                    message: '',
                },
            ],
            required: true,
        }),
        password: inputsFactory({
            validations: (currentInputValue) => [
                {
                    conditional: !currentInputValue,
                    message: '',
                },
                {
                    conditional: !currentInputValue.match(/.{6,}/),
                    message: '',
                },
            ],
            required: true,
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
                        className="c-button"
                        onClick={onClick}
                    >
                        Submit
                    </button>
                    {!hasUser && (
                        <Link href="/sign-up-page">
                            <button className="c-button">Sign up</button>
                        </Link>
                    )}
                </div>
            </fieldset>
        </form>
    );

    function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        name: keyof typeof inputs,
    ) {
        setInputs((prev) => ({
            ...prev,
            [name]: { ...prev[name], value: e.target.value },
        }));
        setInputs((prev) => ({
            ...prev,
            [name]: validateSingle({ ...prev[name] }),
        }));
    }

    function renderError() {
        if (!showMessage) return <div className="form-error-message"></div>;
        return <div className="form-error-message">{DEFAULT_MESSAGE}</div>;
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (showMessage) return;
        if (!isClickable) return;
        if (!validateMany(inputs)) {
            onShowMessage(true);
            onHilightInputs(true);
            onSetTimeOut(() => {
                onShowMessage(false);
                onHilightInputs(false);
            }, 2750);
            onShowInputsMessages(true);
            return;
        }
        handleButtonClick(false);
        onHandledResponse(await onSubmitInputs());
        handleButtonClick(true);
    }

    function onHandledResponse(response: ServerResponse) {
        setUserStateLoading(false);
        setHasUser(response.serverResponse);
        if (!response.serverResponse) {
            onShowMessage(true);
            onHilightInputs(true);
            onSetTimeOut(() => {
                onShowMessage(false);
                onHilightInputs(false);
            }, 2750);
            return;
        }
        user.setUsername(response.body as string);
    }

    async function onSubmitInputs() {
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(omitFields(inputs, FIELDS_TO_OMIT)),
        };
        const response = await fetch(API, options);
        const parsedResponse: ServerResponse = await response.json();
        return parsedResponse;
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
}
