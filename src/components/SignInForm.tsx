import { useCallback, useEffect, useState } from 'react';
import Input from './Input';
import { omitFields } from '@/hooks/useInputsHandler';
import Link from 'next/link';
import useValidate from '@/hooks/useValidate';

const API = 'api/signIn';
const DEFAULT_MESSAGE = 'Incorrect username or password';
const FIELDS_TO_OMIT: (keyof ValidateInputType<string>)[] = [
    'errors',
    'validations',
];

type SignInFormProps = {
    handleUserProps: HandleUserPropsType;
};

type InputsType = 'username' | 'password';

export default function SignInForm({ handleUserProps }: SignInFormProps) {
    const { setUser, setHasUser, hasUser, setUserStateLoading } =
        handleUserProps;
    const { uniqueValidation, manyValidation } = useValidate();
    const [showMessage, onShowMessage] = useState<boolean>(false);
    const [isButtonClickable, setClickableButton] = useState(true);
    const [inputState, setInputState] = useState({
        username: {
            isControlledFromOutside: false,
            showInputMessage: false,
            highlightInput: false,
            justHighlight: false,
            onShowInputMessage: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    username: { ...prev.username, showInputMessage: value },
                })),
            onHighlightInput: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    username: { ...prev.username, highlightInput: value },
                })),
            setControlledFromOutside: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    username: {
                        ...prev.username,
                        isControlledFromOutside: value,
                    },
                })),
            setJustHighlight: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    username: {
                        ...prev.username,
                        justHighlight: value,
                    },
                })),
        },
        password: {
            isControlledFromOutside: false,
            showInputMessage: false,
            highlightInput: false,
            justHighlight: false,
            onShowInputMessage: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    password: { ...prev.password, showInputMessage: value },
                })),
            onHighlightInput: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    password: { ...prev.password, highlightInput: value },
                })),
            setControlledFromOutside: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    password: {
                        ...prev.password,
                        isControlledFromOutside: value,
                    },
                })),
            setJustHighlight: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    password: {
                        ...prev.password,
                        justHighlight: value,
                    },
                })),
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
            value: '',
            errors: [],
        },
    });

    const onControlInputState = useCallback(
        (value: boolean) => {
            for (const i in inputState) {
                const typedIndex = i as InputsType;
                inputState[typedIndex].onHighlightInput(value);
                inputState[typedIndex].onShowInputMessage(value);
                inputState[typedIndex].setControlledFromOutside(value);
                inputState[typedIndex].setJustHighlight(value);
            }
        },
        [inputState],
    );

    useEffect(() => {
        const timerDownMessage = setTimeout(() => {
            onControlInputState(false);
        }, 2750);

        return () => clearTimeout(timerDownMessage);
    }, [onControlInputState]);

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
                            input: uniqueValidation(inputs.username),
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
                            input: uniqueValidation(inputs.password),
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
    }

    function renderError() {
        if (!showMessage) return <div className="form-error-message"></div>;
        return <div className="form-error-message">{DEFAULT_MESSAGE}</div>;
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (manyValidation(inputs)) {
            if (!isButtonClickable) return;
            setClickableButton(false);
            await onSubmitInputs();
        }
        onShowMessage(true);
        onControlInputState(true);
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
            for (const i in inputState) {
                const typedIndex = i as InputsType;
                inputState[typedIndex].onHighlightInput(true);
                inputState[typedIndex].setJustHighlight(true);
                inputState[typedIndex].setControlledFromOutside(true);
            }
            return;
        }
        onControlInputState(false);
        onShowMessage(false);
        setUser({ username: parsedResponse.body as string });
    }
}
