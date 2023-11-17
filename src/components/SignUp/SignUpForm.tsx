import { useState } from 'react';
import Input from '../Input';
import Link from 'next/link';
import useValidate from '@/hooks/useValidate';
import useInputHandler from '@/hooks/useInputHandler';
import { useUser } from '../../context/UserContext';
import useUtils from '@/hooks/useUtils';
import { useRouter } from 'next/router';

const API = 'api/signUp';
const REQUIRED_MESSAGE = 'This field is required';

interface SignUpFormPropsType {
    ownProps: PropsType;
}
interface PropsType {
    setModalState: (data: boolean) => void;
}

type InputsType = 'confirmPassword' | 'password' | 'username';
export default function SignUpForm({ ownProps }: SignUpFormPropsType) {
    const router = useRouter();
    const { setModalState } = ownProps;
    const {
        userState: { hasUser },
    } = useUser();
    const { validateSingle, asyncValidateSingle, validateMany } = useValidate();
    const { inputsFactory, onCheckUsername } = useInputHandler();
    const { onSetTimeOut, onSetAsyncTimeOut } = useUtils();
    const [isClickable, handleClickButton] = useState(true);
    const [inputState, setInputState] = useState({
        username: { showInputMessage: false, highlightInput: false },
        password: { showInputMessage: false, highlightInput: false },
        confirmPassword: { showInputMessage: false, highlightInput: false },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        username: inputsFactory({
            asyncValidations: async ({ value }) => [
                {
                    conditional: await onCheckUsername(value),
                    message: 'This username already exist',
                },
            ],
            validations: ({ value }) => [
                {
                    conditional: !value.match(/.{6,}/),
                    message: 'Username must has 6 characters at least',
                },
                {
                    conditional: !value.match(/^[A-Za-zçÇ]+$/),
                    message: 'Only characters',
                },
            ],
            required: { value: true, message: REQUIRED_MESSAGE },
            attributes: { value: '' },
            errors: [],
        }),
        password: inputsFactory({
            validations: ({ value }, currentInputs) => [
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
            validations: ({ value }, currentInputs) => [
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
                            onChange: (e) => onChangeUsernameInput(e),
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
                    <Input
                        ownProps={{
                            label: 'Confirm Password',
                            inputType: 'password',
                            onChange: (e) => onChange(e, 'confirmPassword'),
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
                        className="c-button"
                        onClick={onClick}
                    >
                        Submit
                    </button>
                    {!hasUser && (
                        <Link key={'signInButton'} href="/">
                            <button className="c-button">Sign In</button>
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
        setInputs((prev) => ({
            ...prev,
            [key]: { ...prev[key], attributes: { value: e.target.value } },
        }));
        setInputState((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                showInputMessage: true,
                highlightInput: true,
            },
        }));
        onSetTimeOut(() => {
            setInputs((prev) => ({
                ...prev,
                [key]: validateSingle(prev[key], prev),
            }));
        }, 950);
    }

    async function onChangeUsernameInput(
        e: React.ChangeEvent<HTMLInputElement>,
    ) {
        handleClickButton(false);
        setInputs((prev) => ({
            ...prev,
            username: {
                ...prev.username,
                attributes: { value: e.target.value },
            },
        }));
        setInputState((prev) => ({
            ...prev,
            username: {
                ...prev.username,
                showInputMessage: true,
                highlightInput: true,
            },
        }));
        onSetAsyncTimeOut(async () => {
            const input = {
                ...inputs.username,
                attributes: { value: e.target.value },
            };
            const currentInputs = {
                ...inputs,
                username: input,
            };
            const validateInput = await asyncValidateSingle(
                input,
                currentInputs,
            );
            setInputs((prev) => ({ ...prev, username: validateInput }));
            handleClickButton(true);
        }, 960);
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (!isClickable) return;
        if (!validateMany(inputs)) {
            onHilightInputs(true);
            onShowInputsMessages(true);
            return;
        }
        handleClickButton(false);
        const handledInputs = onHandleInputs(inputs);
        const response = await onSubmitInputs(handledInputs);
        handleClickButton(() => {
            if (!response.success) {
                setModalState(true);
                return true;
            }
            router.push('/dashboard-page');
            return false;
        });
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
        const response = await fetch(API, options);
        const parsedResponse: DBDefaultResponse = await response.json();
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
