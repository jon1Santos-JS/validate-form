import { useState } from 'react';
import Form from '../Form';
import Input from '../Input';
import { omitFields } from '@/hooks/useInputsHandler';
import { onOmitProps } from '@/lib/lodashAdapter';
const API = 'api/signUp';

interface SignUpFormPropsType {
    ownProps: PropsType;
    handleUserProps: HandleUserPropsType;
}

interface PropsType {
    setResponse: (data: boolean) => void;
}

export default function SignUpForm({ ownProps }: SignUpFormPropsType) {
    const { setResponse } = ownProps;
    const [areValid, setAreValid] = useState(false);
    const [inputs, setInputs] = useState(INPUTS_INITIAL_STATE);

    return (
        <div className="o-sign-up-form">
            <div className="c-container">
                <Form
                    ownProps={{
                        legend: 'SignUp',
                        onSubmitInputs: onSubmitInputs,
                    }}
                    validateProps={{
                        inputs,
                        setShowInputsMessage,
                    }}
                >
                    <Input
                        ownProps={{
                            label: 'Username',
                            inputType: 'text',
                            onChange: (e) => onChange(e, 'username'),
                        }}
                        validateProps={{
                            inputs,
                            input: inputs.username,
                            showInputMessagesFromOutside: areValid,
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
                    <Input
                        ownProps={{
                            label: 'Confirm Password',
                            inputType: 'password',
                            onChange: (e) => onChange(e, 'confirmPassword'),
                        }}
                        validateProps={{
                            input: inputs.confirmPassword,
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
        setInputs((prev) => ({
            ...prev,
            [name]: { ...prev[name], value: e.target.value },
        }));
    }

    function setShowInputsMessage(value: boolean) {
        setAreValid(value);
    }

    async function onSubmitInputs() {
        const handledInputs = omitFields(
            onOmitProps(inputs, ['confirmPassword']) as InputsToValidateType<
                keyof typeof inputs
            >,
            ['errors', 'required', 'validations'],
        );
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledInputs),
        };
        const response = await fetch(API, options);
        const parsedResponse: ServerResponse = await response.json();
        if (typeof parsedResponse.serverResponse === 'string') return;
        if (parsedResponse.serverResponse) {
            window.location.assign('/'); // USING ASSIGN JUST FOR THE SIMULATION
            return;
        }
        setResponse(true);
    }
}

const INPUTS_INITIAL_STATE: InputsToValidateType<
    'confirmPassword' | 'password' | 'username'
> = {
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
        required: true,
        value: '',
        errors: [],
    },
    password: {
        validations: (currentInputValue, hookInputs) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password must has 6 characters at least',
            },
            {
                coditional:
                    currentInputValue !== hookInputs?.confirmPassword.value,
                message: 'This field has to be equal to the confirm password',
            },
        ],
        required: true,
        value: '',
        errors: [],
    },
    confirmPassword: {
        validations: (currentInputValue, hookInputs) => [
            {
                coditional: currentInputValue !== hookInputs?.password.value,
                message: 'This field has to be equal to the password',
            },
        ],
        required: true,
        value: '',
        errors: [],
    },
};
