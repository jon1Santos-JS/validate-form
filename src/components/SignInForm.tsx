import { useState } from 'react';
import Form, { ElementsToAddProps } from './Form';
import Input from './Input';
import { omitFields } from '@/hooks/useInputsHandler';
import Link from 'next/link';

const API = 'api/signIn';
const SIGN_IN_ERROR_RESPONSE = 'Incorrect username or password';
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
    const [ShowInputsMessage, setShowInputsMessage] = useState(false);
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

    return (
        <Form
            ownProps={{
                legend: 'Sign in',
                onSubmitInputs: onSubmitInputs,
                elementsToAdd: elementsToAddFn,
                formError: SIGN_IN_ERROR_RESPONSE,
                className: 'o-sign-in-form',
            }}
            validateProps={{
                onShowInputsMessage,
                inputs,
            }}
        >
            <Input
                ownProps={{
                    label: 'Username',
                    inputType: 'text',
                    onChange: (e) => onChange(e, 'username'),
                }}
                validateProps={{
                    input: inputs.username,
                    showInputMessagesFromOutside: ShowInputsMessage,
                    inputs,
                }}
            />
            <Input
                ownProps={{
                    label: 'Password',
                    inputType: 'password',
                    onChange: (e) => onChange(e, 'password'),
                }}
                validateProps={{
                    input: inputs.password,
                    showInputMessagesFromOutside: ShowInputsMessage,
                    inputs,
                }}
            />
        </Form>
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

    function onShowInputsMessage(value: boolean) {
        setShowInputsMessage(value);
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
            return SIGN_IN_ERROR_RESPONSE;
        }
        setUser({ username: parsedResponse.body as string });
    }

    function elementsToAddFn(props: ElementsToAddProps) {
        return (
            <div className="buttons">
                <button
                    key={'submitButton'}
                    className="c-button"
                    onClick={props.onClick}
                >
                    Submit
                </button>
                {!hasUser && (
                    <Link href="/sign-up-page">
                        <button className="c-button">Sign up</button>
                    </Link>
                )}
            </div>
        );
    }
}
