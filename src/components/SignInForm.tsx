import { useEffect, useState } from 'react';
import Input from './Input';
import { omitFields } from '@/hooks/useInputsHandler';
import Link from 'next/link';
import useValidate from '@/hooks/useValidate';

const API = 'api/signIn';
const DEFAULT_MESSAGE = 'Incorrect username or password';
const FIELDS_TO_OMIT: (keyof ValidateInputType<string>)[] = [
    'errors',
    'required',
    'validations',
];

type SignInFormProps = {
    handleUserProps: HandleUserPropsType;
};

export default function SignInForm({ handleUserProps }: SignInFormProps) {
    const { setUser, setHasUser, hasUser, setUserStateLoading } =
        handleUserProps;
    const { uniqueValidation, manyValidation } = useValidate();
    const [showInputsMessage, onShowInputsMessage] = useState(false);
    const [highlightInput, onHighlightInput] = useState(false);
    const [showMessage, onShowMessage] = useState<boolean>(false);
    const [message, setMessage] = useState(DEFAULT_MESSAGE);
    const [inputs, setInputs] = useState({
        username: {
            validations: (currentInputValue: string) => [
                {
                    coditional: !currentInputValue.match(/.{6,}/),
                },
                {
                    coditional: !currentInputValue.match(/^[A-Za-z]+$/),
                },
            ],
            required: true,
            value: '',
            errors: [],
        },
        password: {
            validations: (currentInputValue: string) => [
                {
                    coditional: !currentInputValue.match(/.{6,}/),
                },
            ],
            required: true,
            value: '',
            errors: [],
        },
    });

    useEffect(() => {
        const timerDownMessage = setTimeout(() => {
            onShowMessage(false);
        }, 2750);

        return () => clearTimeout(timerDownMessage);
    }, [showMessage]);

    useEffect(() => {
        const timerDownMessage = setTimeout(() => {
            onHighlightInput(false);
        }, 2750);

        return () => clearTimeout(timerDownMessage);
    }, [highlightInput]);

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
                        validateProps={{
                            input: uniqueValidation(inputs.username),
                            showInputMessagesFromOutside: showInputsMessage,
                            hightlightInputFromOutside: highlightInput,
                        }}
                    />
                    <Input
                        ownProps={{
                            label: 'Password',
                            inputType: 'password',
                            onChange: (e) => onChange(e, 'password'),
                        }}
                        validateProps={{
                            input: uniqueValidation(inputs.password),
                            showInputMessagesFromOutside: showInputsMessage,
                            hightlightInputFromOutside: highlightInput,
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
        return <div className="form-error-message">{message}</div>;
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (showMessage) return; // WAITING THE MESSAGE GOES DOWN TO REQUEST
        if (manyValidation(inputs)) {
            await onSubmitInputs();
            return;
        }
        onShowMessage(true);
        onHighlightInput(true);
        onShowInputsMessage(true);
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
            setMessage(DEFAULT_MESSAGE);
            return;
        }
        onShowInputsMessage(false);
        onShowMessage(false);
        setUser({ username: parsedResponse.body as string });
    }
}
