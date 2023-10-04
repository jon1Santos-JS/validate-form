import { useEffect, useState } from 'react';
import Input from '../Input';
import { omitFields, preventCompareEmptyField } from '@/hooks/useInputsHandler';
import { onOmitProps } from '@/lib/lodashAdapter';
import Link from 'next/link';
import useValidate from '@/hooks/useValidate';

const API = 'api/signUp';
const INPUTS_TO_OMIT = ['confirmPassword'] as InputsType[];
const FIELDS_TO_OMIT: (keyof ValidateInputType<string>)[] = [
    'errors',
    'required',
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

    const [highlightInput, onHighlightInput] = useState(false);
    const [showInputsMessage, onShowInputsMessage] = useState(false);
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

    // useEffect(() => {
    //     const timerDownMessage = setTimeout(() => {
    //         onHighlightInput(false);
    //     }, 2750);

    //     return () => clearTimeout(timerDownMessage);
    // }, [highlightInput]);

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
                        validateProps={{
                            input: uniqueValidation(inputs.username),
                            highlightInput,
                            showInputMessagesFromOutside: showInputsMessage,
                        }}
                    />
                    <Input
                        ownProps={{
                            label: 'Password',
                            inputType: 'password',
                            onChange: (e) => onChange(e, 'password'),
                        }}
                        validateProps={{
                            input: uniqueValidation(inputs.password, inputs),
                            highlightInput,
                            showInputMessagesFromOutside: showInputsMessage,
                        }}
                    />
                    <Input
                        ownProps={{
                            label: 'Confirm Password',
                            inputType: 'password',
                            onChange: (e) => onChange(e, 'confirmPassword'),
                        }}
                        validateProps={{
                            input: uniqueValidation(
                                inputs.confirmPassword,
                                inputs,
                            ),
                            showInputMessagesFromOutside: showInputsMessage,
                            highlightInput,
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
        name: keyof typeof inputs,
    ) {
        setInputs((prev) => ({
            ...prev,
            [name]: { ...prev[name], value: e.target.value },
        }));
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (manyValidation(inputs)) {
            await onSubmitInputs();
        }
        onHighlightInput(true);
        onShowInputsMessage(true);
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
        onShowInputsMessage(false);
        window.location.assign('/'); // WINDOW.ASSIGN JUST TO SIMULATE
    }
}
