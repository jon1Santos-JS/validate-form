import { useEffect, useState } from 'react';
import Input from './Input';
import Link from 'next/link';
import useValidate from '@/hooks/useValidate';
import useInputHandler from '@/hooks/useInputHandler';
import { useAuth } from '../context/UserContext';
import useUtils from '@/hooks/useUtils';
import { useRouter } from 'next/router';

const SIGN_UP_API = 'api/signUp';
const REQUIRED_MESSAGE = 'This field is required';

type InputsType = 'confirmPassword' | 'password' | 'username';

type SignUpProps = {
    setModalMessage: (message: string) => void;
    onOpenDangerModal: () => void;
    isDangerModalOpen: boolean;
};
export default function SignUpForm({
    setModalMessage,
    onOpenDangerModal,
    isDangerModalOpen,
}: SignUpProps) {
    const router = useRouter();
    const {
        userState: { hasUser },
    } = useAuth();
    const { validateSingleSync, validateMany } = useValidate();
    const { inputsFactory } = useInputHandler();
    const { onSetTimeOut } = useUtils();
    const [isRequesting, setRequestState] = useState(false);
    const [inputState, setInputState] = useState({
        username: { showInputMessage: false, highlightInput: false },
        password: { showInputMessage: false, highlightInput: false },
        confirmPassword: { showInputMessage: false, highlightInput: false },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        username: inputsFactory({
            validationsSync: ({ value }) => [
                {
                    conditional: !value.match(/^[A-Za-z]*$/),
                    message: 'Do not use special characters or numbers',
                },
                {
                    conditional: !value.match(/.{6,}/),
                    message: 'Username must has 6 characters at least',
                },
            ],
            required: { value: true, message: REQUIRED_MESSAGE },
            attributes: { value: '' },
            requestErrors: [],
            errors: [],
        }),
        password: inputsFactory({
            validationsSync: ({ value }, currentInputs) => [
                {
                    conditional: !value.match(/.{6,}/),
                    message: 'Password must has 6 characters at least',
                },
                {
                    conditional:
                        value !==
                        currentInputs?.confirmPassword.attributes.value,
                    message:
                        'This field has to be equal to the confirm password',
                },
            ],
            required: { value: true, message: REQUIRED_MESSAGE },
            crossfields: ['confirmPassword'],
            attributes: { value: '' },
            errors: [],
        }),
        confirmPassword: inputsFactory({
            validationsSync: ({ value }, currentInputs) => [
                {
                    conditional:
                        value !== currentInputs?.password.attributes.value,
                    message: 'This field has to be equal to the password',
                },
            ],
            required: { value: true, message: REQUIRED_MESSAGE },
            crossfields: ['password'],
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

    return (
        <form className="o-sign-up-form">
            <fieldset className="container">
                <div className="legend l-text--primary">
                    <legend>Sign up</legend>
                </div>
                <div className="inputs">
                    <Input
                        ownProps={{
                            label: 'Username',
                            inputType: 'text',
                            onChange: (e) => onChange(e, 'username'),
                            className: `${
                                isRequesting || isDangerModalOpen
                                    ? 'is-input-disabled'
                                    : ''
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
                                isRequesting || isDangerModalOpen
                                    ? 'is-input-disabled'
                                    : ''
                            }`,
                        }}
                        inputStateProps={{
                            input: inputs.password,
                            inputState: inputState.password,
                        }}
                    />
                    <Input
                        ownProps={{
                            label: 'Confirm Password',
                            inputType: 'password',
                            onChange: (e) => onChange(e, 'confirmPassword'),
                            className: `${
                                isRequesting || isDangerModalOpen
                                    ? 'is-input-disabled'
                                    : ''
                            }`,
                        }}
                        inputStateProps={{
                            input: inputs.confirmPassword,
                            inputState: inputState.confirmPassword,
                        }}
                    />
                </div>
                <div className="buttons">
                    <button
                        key={'submitButton'}
                        className="c-button--primary button"
                        onClick={onClick}
                    >
                        Submit
                    </button>
                    {!hasUser && (
                        <Link key={'signInButton'} href="/">
                            <button className="c-button--primary button">
                                Sign In
                            </button>
                        </Link>
                    )}
                </div>
            </fieldset>
        </form>
    );

    async function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        key: InputsType,
    ) {
        if (isRequesting) return;
        if (isDangerModalOpen) return;
        setInputs((prev) => ({
            ...prev,
            [key]: { ...prev[key], attributes: { value: e.target.value } },
        }));
        onSetTimeOut(() => {
            setInputs((prev) => ({
                ...prev,
                [key]: validateSingleSync(prev[key], prev),
            }));
            setInputState((prev) => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    showInputMessage: true,
                    highlightInput: true,
                },
            }));
        }, 950);
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (isDangerModalOpen) return;
        if (isRequesting) return;
        if (!(await validateMany(inputs))) {
            onHilightInputs(true);
            onShowInputsMessages(true);
            return;
        }
        const handledInputs = onHandleInputs(inputs);
        setRequestState(true);
        await onSubmitInputs(handledInputs);
        setRequestState(false);
    }

    function onHandleInputs(inputsToHandle: InputsToValidateType<InputsType>) {
        const { username, password } = inputsToHandle;
        return {
            username: { value: username.attributes.value },
            password: { value: password.attributes.value },
        };
    }

    async function onSubmitInputs(handledInputs: UserFromClient) {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledInputs),
        };
        const response = await fetch(SIGN_UP_API, options);
        const parsedResponse: DBDefaultResponse = await response.json();
        if (!parsedResponse.success) {
            if (parsedResponse.data.includes('limit')) {
                setModalMessage(parsedResponse.data);
                onOpenDangerModal();
                return;
            }
            onSetRequestErrorMessage('username', parsedResponse.data);
            setInputState((prev) => ({
                ...prev,
                username: {
                    ...prev.username,
                    highlightInput: true,
                    showInputMessage: true,
                },
            }));
            return;
        }
        onSetRequestErrorMessage('username');
        router.push('/dashboard-page');
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
            confirmPassword: {
                ...prev.confirmPassword,
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
            confirmPassword: {
                ...prev.confirmPassword,
                showInputMessage: value,
            },
        }));
    }
}
