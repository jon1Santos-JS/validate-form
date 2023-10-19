import { useState } from 'react';
import Input from '../Input';
import { onOmitProps } from '@/lib/lodashAdapter';
import Link from 'next/link';
import useValidate from '@/hooks/useValidate';
import useInputHandler, { FIELDS_TO_OMIT } from '@/hooks/useInputHandler';
import { useUser } from '../../context/UserContext';

const API = 'api/signUp';
const INPUTS_TO_OMIT = ['confirmPassword'] as InputsType[];
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
    const { uniqueValidation, manyValidation } = useValidate();
    const { omitFields, onHighlightManyInputs, onSetTimeOut } =
        useInputHandler();
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
        confirmPassword: {
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
                    coditional: !currentInputValue.match(/.{6,}/),
                    message: 'Username must has 6 characters at least',
                },
                {
                    coditional: !currentInputValue.match(/^[A-Za-zçÇ]+$/),
                    message: 'Only characters',
                },
            ],
            required: REQUIRED_MESSAGE,
            value: '',
            errors: [],
        },
        password: {
            validations: (currentInputValue, inputs) => [
                {
                    coditional: !currentInputValue.match(/.{6,}/),
                    message: 'Password must has 6 characters at least',
                },
                {
                    coditional:
                        currentInputValue !== inputs?.confirmPassword.value,
                    message:
                        'This field has to be equal to the confirm password',
                    crossfield: 'confirmPassword',
                },
            ],
            required: REQUIRED_MESSAGE,
            value: '',
            errors: [],
        },
        confirmPassword: {
            validations: (currentInputValue, inputs) => [
                {
                    coditional: currentInputValue !== inputs?.password.value,
                    message: 'This field has to be equal to the password',
                    crossfield: 'password',
                },
            ],
            required: REQUIRED_MESSAGE,
            value: '',
            errors: [],
        },
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
                            onChange: (e) => onChange(e, 'username'),
                        }}
                        inputStateProps={{
                            input: inputs.username,
                            inputState: inputState.username,
                        }}
                        formProps={{
                            hasError: false,
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
                            hasError: false,
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
                        formProps={{
                            hasError: false,
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

    function onChange(e: React.ChangeEvent<HTMLInputElement>, key: InputsType) {
        setInputs((prev) => ({
            ...prev,
            [key]: { ...prev[key], value: e.target.value },
        }));
        onSetTimeOut(() => {
            setInputs((prev) => ({
                ...prev,
                [key]: uniqueValidation({ ...prev[key] }, prev),
            }));
        }, 950);
        inputState[key].onHighlightInput(true, key);
        inputState[key].onShowInputMessage(true, key);
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

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (manyValidation(inputs)) {
            if (!isButtonClickable) return;
            setClickableButton(false);
            await onSubmitInputs();
        }
        onHighlightManyInputs(inputState, true, 3);
        setClickableButton(true);
    }

    async function onSubmitInputs() {
        const handledInputs = omitFields(
            onOmitProps(inputs, INPUTS_TO_OMIT) as InputsToValidateType<
                keyof typeof inputs
            >,
            FIELDS_TO_OMIT,
        );
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledInputs),
        };
        const response = await fetch(API, options);
        const parsedResponse: ServerResponse = await response.json();
        if (!parsedResponse.serverResponse) {
            setModalState(true);
            return;
        }
        onHighlightManyInputs(inputState, false, 3);
        window.location.assign('/dashboard-page');
    }
}
