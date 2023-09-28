import { useState } from 'react';
import Form from '../Form';
import Input from '../Input';
import { omitFields, preventCompareEmptyField } from '@/hooks/useInputsHandler';
import { onOmitProps } from '@/lib/lodashAdapter';

const API = 'api/signUp';
const INPUTS_TO_OMIT = ['confirmPassword'] as InputsType[];
const FIELDS_TO_OMIT: (keyof ValidateInputType<string>)[] = [
    'errors',
    'required',
    'validations',
];

interface SignUpFormPropsType {
    ownProps: PropsType;
    handleUserProps: HandleUserPropsType;
}

interface PropsType {
    onShowModal: (data: boolean) => void;
}

type InputsType = 'confirmPassword' | 'password' | 'username';

export default function SignUpForm({ ownProps }: SignUpFormPropsType) {
    const { onShowModal } = ownProps;
    const [ShowInputsMessage, setShowInputsMessage] = useState(false);
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
                        onShowInputsMessage,
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
                            showInputMessagesFromOutside: ShowInputsMessage,
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
                    <Input
                        ownProps={{
                            label: 'Confirm Password',
                            inputType: 'password',
                            onChange: (e) => onChange(e, 'confirmPassword'),
                        }}
                        validateProps={{
                            input: inputs.confirmPassword,
                            showInputMessagesFromOutside: ShowInputsMessage,
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

    function onShowInputsMessage(value: boolean) {
        setShowInputsMessage(value);
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
            onShowModal(true);
            return;
        }
        window.location.assign('/'); // WINDOW.ASSIGN JUST FOR THE SIMULATION
    }
}

const INPUTS_INITIAL_STATE: InputsToValidateType<InputsType> = {
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
                coditional: preventCompareEmptyField(
                    hookInputs?.confirmPassword.value,
                    currentInputValue !== hookInputs?.confirmPassword.value,
                ),
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
