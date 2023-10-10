import { useState } from 'react';
import Input from '../Input';
import { omitFields, preventCompareEmptyField } from '@/hooks/useInputsHandler';
import { onOmitProps } from '@/lib/lodashAdapter';
import Link from 'next/link';
import useValidate from '@/hooks/useValidate';

const API = 'api/signUp';
const INPUTS_TO_OMIT = ['confirmPassword'] as InputsType[];
const FIELDS_TO_OMIT: (keyof ValidateInputType<string>)[] = [
    'errors',
    'validations',
];
const REQUIRED_MESSAGE = 'This field is required';

interface SignUpFormPropsType {
    ownProps: PropsType;
    handleUserProps: HandleUserPropsType;
}

interface PropsType {
    setModalState: (data: boolean) => void;
}

type InputsType = 'confirmPassword' | 'password' | 'username';

export default function SignUpForm({
    ownProps,
    handleUserProps,
}: SignUpFormPropsType) {
    const { setModalState } = ownProps;
    const { hasUser } = handleUserProps;
    const { uniqueValidation, manyValidation } = useValidate();
    const [isButtonClickable, setClickableButton] = useState(true);
    const [inputState, setInputState] = useState({
        username: {
            isControlledFromOutside: false,
            showInputMessage: false,
            highlightInput: false,
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
        },
        password: {
            isControlledFromOutside: false,
            showInputMessage: false,
            highlightInput: false,
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
        },
        confirmPassword: {
            isControlledFromOutside: false,
            showInputMessage: false,
            highlightInput: false,
            onShowInputMessage: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    confirmPassword: {
                        ...prev.confirmPassword,
                        showInputMessage: value,
                    },
                })),
            onHighlightInput: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    confirmPassword: {
                        ...prev.confirmPassword,
                        highlightInput: value,
                    },
                })),
            setControlledFromOutside: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    confirmPassword: {
                        ...prev.confirmPassword,
                        isControlledFromOutside: value,
                    },
                })),
        },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        username: {
            validations: (currentInputValue) => [
                {
                    coditional: !currentInputValue,
                    message: REQUIRED_MESSAGE,
                },
                {
                    coditional: !currentInputValue.match(/.{6,}/),
                    message: 'Username must has 6 characters at least',
                },
                {
                    coditional: !currentInputValue.match(/^[A-Za-zçÇ]+$/),
                    message: 'Only characters',
                },
            ],
            value: '',
            errors: [],
        },
        password: {
            validations: (currentInputValue, inputs) => [
                {
                    coditional: !currentInputValue,
                    message: REQUIRED_MESSAGE,
                },
                {
                    coditional: !currentInputValue.match(/.{6,}/),
                    message: 'Password must has 6 characters at least',
                },
                {
                    coditional: preventCompareEmptyField(
                        currentInputValue !== inputs?.confirmPassword.value,
                        inputs?.confirmPassword.value,
                    ),
                    message:
                        'This field has to be equal to the confirm password',
                },
            ],
            value: '',
            errors: [],
        },
        confirmPassword: {
            validations: (currentInputValue, inputs) => [
                {
                    coditional: !currentInputValue,
                    message: REQUIRED_MESSAGE,
                },
                {
                    coditional: currentInputValue !== inputs?.password.value,
                    message: 'This field has to be equal to the password',
                },
            ],
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
                            input: uniqueValidation(inputs.password, inputs),
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
                            input: uniqueValidation(
                                inputs.confirmPassword,
                                inputs,
                            ),
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

    function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        inputKey: InputsType,
    ) {
        setInputs((prev) => ({
            ...prev,
            [inputKey]: { ...prev[inputKey], value: e.target.value },
        }));
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (manyValidation(inputs)) {
            if (!isButtonClickable) return;
            setClickableButton(false);
            await onSubmitInputs();
        }
        for (const i in inputState) {
            const typedIndex = i as InputsType;
            inputState[typedIndex].onHighlightInput(true);
            inputState[typedIndex].onShowInputMessage(true);
            inputState[typedIndex].setControlledFromOutside(true);
        }
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
        for (const i in inputState) {
            const typedIndex = i as InputsType;
            inputState[typedIndex].onShowInputMessage(true);
            inputState[typedIndex].setControlledFromOutside(true);
        }
        window.location.assign('/dashboard-page');
    }
}
