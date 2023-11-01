import { useState } from 'react';
import Input from '../Input';
import { onOmitProps } from '@/lib/lodashAdapter';
import Link from 'next/link';
import useValidate from '@/hooks/useValidate';
import useInputHandler, { FIELDS_TO_OMIT } from '@/hooks/useInputHandler';
import { useUser } from '../../context/UserContext';

const API = 'api/signUp';
const INPUTS_TO_OMIT: 'confirmPassword'[] = ['confirmPassword'];
const REQUIRED_MESSAGE = 'This field is required';

interface SignUpFormPropsType {
    ownProps: PropsType;
}
interface PropsType {
    setModalState: (data: boolean) => void;
}

type InputsType = 'confirmPassword' | 'password' | 'username';
export default function SignUpForm({ ownProps }: SignUpFormPropsType) {
    const { setModalState } = ownProps;
    const {
        userState: { hasUser },
    } = useUser();
    const { validateSingle, asyncValidateSingle, validateMany } = useValidate();
    const { omitFields, onSetTimeOut, inputsFactory, onCheckUsername } =
        useInputHandler();
    const [isClickable, handleButtonClick] = useState(true);
    const [inputState, setInputState] = useState({
        username: { showInputMessage: false, highlightInput: false },
        password: { showInputMessage: false, highlightInput: false },
        confirmPassword: { showInputMessage: false, highlightInput: false },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        username: inputsFactory({
            asyncValidations: async (currentInputValue) => [
                {
                    conditional: await onCheckUsername(currentInputValue),
                    message: 'This username already exist',
                },
            ],
            validations: (currentInputValue) => [
                {
                    conditional: !currentInputValue.match(/.{6,}/),
                    message: 'Username must has 6 characters at least',
                },
                {
                    conditional: !currentInputValue.match(/^[A-Za-zçÇ]+$/),
                    message: 'Only characters',
                },
            ],
            required: REQUIRED_MESSAGE,
        }),
        password: inputsFactory({
            validations: (currentInputValue, inputs) => [
                {
                    conditional: !currentInputValue.match(/.{6,}/),
                    message: 'Password must has 6 characters at least',
                },
                {
                    conditional:
                        currentInputValue !== inputs?.confirmPassword.value,
                    message:
                        'This field has to be equal to the confirm password',
                },
            ],
            required: REQUIRED_MESSAGE,
            crossfields: ['confirmPassword'],
        }),
        confirmPassword: inputsFactory({
            validations: (currentInputValue, inputs) => [
                {
                    conditional: currentInputValue !== inputs?.password.value,
                    message: 'This field has to be equal to the password',
                },
            ],
            required: REQUIRED_MESSAGE,
            crossfields: ['password'],
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
            [key]: { ...prev[key], value: e.target.value },
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
        handleButtonClick(false);
        setInputs((prev) => ({
            ...prev,
            username: { ...prev.username, value: e.target.value },
        }));
        setInputState((prev) => ({
            ...prev,
            username: {
                ...prev.username,
                showInputMessage: true,
                highlightInput: true,
            },
        }));
        onSetTimeOut(async () => {
            const input = { ...inputs.username, value: e.target.value };
            const currentInputs = {
                ...inputs,
                username: input,
            };
            const validateInput = await asyncValidateSingle(
                input,
                currentInputs,
            );
            setInputs((prev) => ({ ...prev, username: validateInput }));
            handleButtonClick(true);
        }, 950);
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (!isClickable) return;
        if (!validateMany(inputs)) {
            onHilightInputs(true);
            onShowInputsMessages(true);
            return;
        }
        const handledInputs = onHandleInputs(inputs);
        handleButtonClick(false);
        const submitResponse = await onSubmitInputs(handledInputs);
        handleButtonClick(true);
        onHandleResponse(submitResponse);
    }

    function onHandleInputs(inputs: InputsToValidateType<InputsType>) {
        const handledInputs = onOmitProps(inputs, INPUTS_TO_OMIT);
        const handledFields = omitFields(handledInputs, FIELDS_TO_OMIT);
        return handledFields;
    }

    async function onSubmitInputs<T extends string>(
        handledInputs: HandledInputsType<T>,
    ) {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledInputs),
        };
        const response = await fetch(API, options);
        const parsedResponse: ServerResponse = await response.json();
        return parsedResponse;
    }

    function onHandleResponse(response: ServerResponse) {
        if (!response.serverResponse) {
            setModalState(true);
            return;
        }
        window.location.assign('/dashboard-page');
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
