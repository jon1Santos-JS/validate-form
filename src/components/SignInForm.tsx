import { useState } from 'react';
import Form from './Form';
import Input from './Input';
import { omitFields } from '@/hooks/useInputsHandler';

type SignInFormProps = {
    handleUserProps: HandleUserPropsType;
};

const SIGN_IN_ERROR_RESPONSE = 'Incorrect username or password';

export default function SignInForm({ handleUserProps }: SignInFormProps) {
    const { setUser, setHasUser, setUserStateLoading } = handleUserProps;
    const [areValid, setAreValid] = useState(false);
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
        <div className="o-sign-in-form">
            <div className="c-container">
                <Form
                    ownProps={{
                        legend: 'SignIn',
                        onSubmitInputs: onSubmitInputs,
                        formError: SIGN_IN_ERROR_RESPONSE,
                    }}
                    validateProps={{
                        setShowInputsMessage,
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
                            showInputMessagesFromOutside: areValid,
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
                            showInputMessagesFromOutside: areValid,
                            inputs,
                        }}
                    />
                </Form>
            </div>
        </div>
    );

    function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        name: keyof typeof inputs,
    ) {
        setInputs((prev) => {
            const newObj = {
                ...prev,
                [name]: { ...prev[name], value: e.target.value },
            };
            return { ...newObj };
        });
    }

    function setShowInputsMessage(value: boolean) {
        setAreValid(value);
    }

    async function onSubmitInputs() {
        const action = process.env.NEXT_PUBLIC_SIGN_IN_LINK as string;
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                omitFields(inputs, ['errors', 'required', 'validations']),
            ),
        };
        const response = await fetch(action, options);
        const parsedResponse: ServerResponse = await response.json();
        setUserStateLoading(false);
        setHasUser(parsedResponse.serverResponse);
        if (!parsedResponse.serverResponse) {
            return SIGN_IN_ERROR_RESPONSE;
        }
        window.location.assign('/dashboard-page');
        setUser({ username: parsedResponse.body as string });
    }
}
