import { useEffect, useState } from 'react';
import Input from './Input';
import Link from 'next/link';
import useValidate from '@/hooks/useValidate';
import useInputHandler from '@/hooks/useInputHandler';
import { useAuth } from '../context/UserContext';
import useUtils from '@/hooks/useUtils';
import { useRouter } from 'next/router';

const SIGN_UP_API = 'api/signUp';
const CHECK_USERNAME_API = 'api/checkUsername';
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
    const { validateSingle, validateSingleSync, validateMany } = useValidate();
    const { inputsFactory, onCheckUsername } = useInputHandler();
    const { onSetTimeOut, onSetAsyncTimeOut } = useUtils();
    const [isRequesting, setRequestState] = useState(false);
    const [inputState, setInputState] = useState({
        username: { showInputMessage: false, highlightInput: false },
        password: { showInputMessage: false, highlightInput: false },
        confirmPassword: { showInputMessage: false, highlightInput: false },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        username: inputsFactory({
            validations: async ({ value }) => [
                {
                    conditional: await onCheckUsername(CHECK_USERNAME_API, {
                        method: 'POST',
                        body: value,
                    }),
                    message: 'This username already exist',
                },
            ],
            validationsSync: ({ value }) => [
                {
                    conditional: !value.match(/^[A-Za-z]*$/),
                    message: 'No special characters',
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
                <div className="legend">
                    <legend>Sign up</legend>
                </div>
                <div className="inputs">
                    <Input
                        ownProps={{
                            label: 'Username',
                            inputType: 'text',
                            onChange: (e) => onChangeInputUsername(e),
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
                        className="c-button button"
                        onClick={onClick}
                    >
                        Submit
                    </button>
                    {!hasUser && (
                        <Link key={'signInButton'} href="/">
                            <button className="c-button button">Sign In</button>
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

    async function onChangeInputUsername(
        e: React.ChangeEvent<HTMLInputElement>,
    ) {
        if (isDangerModalOpen) return;
        if (isRequesting) return;
        setInputs((prev) => ({
            ...prev,
            username: {
                ...prev.username,
                attributes: { value: e.target.value },
            },
        }));

        await onSetAsyncTimeOut(async () => {
            const input = {
                ...inputs.username,
                attributes: { value: e.target.value },
            };
            const currentInputs = {
                ...inputs,
                username: input,
            };
            const validatedInput = await validateSingle(input, currentInputs);
            setInputs((prev) => ({ ...prev, username: validatedInput }));
            setInputState((prev) => ({
                ...prev,
                username: {
                    ...prev.username,
                    showInputMessage: true,
                    highlightInput: true,
                },
            }));
        }, 960);
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (isDangerModalOpen) return;
        if (areErrorsUp()) return;
        if (isRequesting) return;
        setRequestState(true);
        if (!(await validateMany(inputs))) {
            onHilightInputs(true);
            onShowInputsMessages(true);
            setRequestState(false);
            return;
        }
        const handledInputs = onHandleInputs(inputs);
        setRequestState(true);
        await onSubmitInputs(handledInputs);
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
            setRequestState(false);
            if (parsedResponse.data.includes('limit')) {
                setModalMessage(parsedResponse.data);
                onOpenDangerModal();
                return;
            }
            onSetRequestErrorMessage('username', parsedResponse.data);
            return;
        }
        router.push('/dashboard-page');
    }

    function areErrorsUp() {
        let isValid = false;
        for (const i in inputState) {
            if (inputState[i as InputsType].showInputMessage) isValid = true;
        }
        return isValid;
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
