import { useEffect, useState } from 'react';
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
    const { uniqueValidation, manyValidation } = useValidate();
    const { omitFields, onHighlightManyInputs } = useInputHandler();
    const [showMessage, onShowMessage] = useState<boolean>(false);
    const [isButtonClickable, setClickableButton] = useState(true);
    const [inputState, setInputState] = useState({
        username: {
            showInputMessage: false,
            highlightInput: false,
            onShowInputMessage: onShowInputMessage,
            onHighlightInput: onHighlightInput,
        },
        password: {
            showInputMessage: false,
            highlightInput: false,
            onShowInputMessage: onShowInputMessage,
            onHighlightInput: onHighlightInput,
        },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        username: {
            validations: (currentInputValue) => [
                {
                    coditional: !currentInputValue,
                    message: '',
                },
                {
                    coditional: !currentInputValue.match(/.{6,}/),
                    message: '',
                },
                {
                    coditional: !currentInputValue.match(/^[A-Za-z]+$/),
                    message: '',
                },
            ],
            required: true,
            value: '',
            errors: [],
        },
        password: {
            validations: (currentInputValue) => [
                {
                    coditional: !currentInputValue,
                    message: '',
                },
                {
                    coditional: !currentInputValue.match(/.{6,}/),
                    message: '',
                },
            ],
            required: true,
            value: '',
            errors: [],
        },
    });

    useEffect(() => {
        const timerDownMessage = setTimeout(() => {
            onHighlightManyInputs(inputState, false, 2);
        }, 2750);

        return () => clearTimeout(timerDownMessage);
    }, [inputState, onHighlightManyInputs]);

    useEffect(() => {
        const timerDownMessage = setTimeout(() => {
            onShowMessage(false);
        }, 2750);

        return () => clearTimeout(timerDownMessage);
    }, [showMessage]);

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
                        formProps={{
                            hasError: true,
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
                        formProps={{
                            hasError: true,
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
            [name]: uniqueValidation({ ...prev[name] }),
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

    function renderError() {
        if (!showMessage) return <div className="form-error-message"></div>;
        return <div className="form-error-message">{DEFAULT_MESSAGE}</div>;
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (showMessage) return;
        if (manyValidation(inputs)) {
            if (!isButtonClickable) return;
            setClickableButton(false);
            await onSubmitInputs();
        }
        onShowMessage(true);
        onHighlightManyInputs(inputState, true, 3);
        setClickableButton(true);
    }

    async function onSubmitInputs() {
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(omitFields(inputs, FIELDS_TO_OMIT)),
        };
        const response = await fetch(API, options);
        const parsedResponse: ServerResponse = await response.json();
        setUserStateLoading(false);
        setHasUser(parsedResponse.serverResponse);
        if (!parsedResponse.serverResponse) {
            onShowMessage(true);
            onHighlightManyInputs(inputState, true, 2);
            return;
        }
        onHighlightManyInputs(inputState, false, 3);
        onShowMessage(false);
        user.setUsername(parsedResponse.body as string);
    }
}
