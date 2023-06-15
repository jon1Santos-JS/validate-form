import { useState } from 'react';
import Form from '../Form';
import Input from '../Input';
import useValidate from '@/hooks/useValidate';
import { useRouter } from 'next/router';

interface SignUpFormPropsType {
    setResponse: (data: boolean) => void;
}

export default function SignUpForm({ setResponse }: SignUpFormPropsType) {
    const {
        validateUsername,
        validatePassword,
        validateAllInputs,
        validateConfirmPassword,
        validateEmail,
        validateConfirmEmail,
    } = useValidate(inputs);
    const router = useRouter();
    // CROSS VALIDATE INPUTS
    const [crossPassword, setCrossPassword] = useState({
        password: '',
        confirmPassword: '',
    });
    const [crossEmail, setCrossEmail] = useState({
        email: '',
        confirmEmail: '',
    });

    return (
        <div className="o-sign-up-form">
            <div className="c-container">
                <Form
                    inputs={inputs}
                    haveInputsErrors={validateAllInputs}
                    legend="SignUp"
                    onSubmitInputs={onSubmitInputs}
                >
                    <Input
                        label="Username"
                        inputType="text"
                        fieldName="username"
                        validation={validateUsername}
                    />
                    <Input
                        label="Password"
                        inputType="password"
                        fieldName="password"
                        validation={validatePassword}
                        crossValidation={(value: string) => {
                            setCrossPassword({
                                password: value,
                                confirmPassword: crossPassword.confirmPassword,
                            });
                        }}
                    />
                    <Input
                        label="Confirm Password"
                        inputType="confirmPassword"
                        fieldName="password"
                        validation={validateConfirmPassword}
                        crossValidation={(value: string) => {
                            setCrossPassword({
                                password: crossPassword.password,
                                confirmPassword: value,
                            });
                        }}
                    />
                    <Input
                        label="Email"
                        inputType="text"
                        fieldName="email"
                        validation={validateEmail}
                        crossValidation={(value: string) => {
                            setCrossEmail({
                                email: value,
                                confirmEmail: crossEmail.confirmEmail,
                            });
                        }}
                    />
                    <Input
                        label="Confirm Email"
                        inputType="text"
                        fieldName="confirmEmail"
                        validation={validateConfirmEmail}
                        crossValidation={(value: string) => {
                            setCrossEmail({
                                email: crossEmail.email,
                                confirmEmail: value,
                            });
                        }}
                    />
                </Form>
            </div>
        </div>
    );

    async function onSubmitInputs<T>(formContent: T) {
        const action = process.env.NEXT_PUBLIC_SIGN_UP_LINK as string;
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formContent),
        };
        const response = await fetch(action, options);
        const parsedResponse: ServerResponse = await response.json();
        if (typeof parsedResponse.serverResponse === 'string') return;
        if (parsedResponse.serverResponse) {
            router.push('/');
            return;
        }
        setResponse(true);
    }
}

const inputs: PreFormInputsType = {
    username: {
        validations: (currentInputValue) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Username must has 6 characters at least',
            },
        ],
        required: true,
    },
    password: {
        validations: (currentInputValue, formInputs) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password must has 6 characters at least',
            },
            {
                coditional:
                    currentInputValue !== formInputs['confirmPassword'].value,
                message: 'This field has to be equal to the confirm password',
            },
        ],
        required: true,
    },
    confirmPassword: {
        validations: (currentInputValue, formInputs) => [
            {
                coditional: currentInputValue !== formInputs['password'].value,
                message: 'This field has to be equal to the password',
            },
        ],
        required: true,
    },
    email: {
        validations: (currentInputValue, formInputs) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password must has 6 characters at least',
            },
            {
                coditional:
                    currentInputValue !== formInputs['confirmEmail'].value,
                message: 'This field has to be equal to the confirmEmail',
            },
        ],
        required: true,
    },
    confirmEmail: {
        validations: (currentInputValue, formInputs) => [
            {
                coditional: currentInputValue !== formInputs['email'].value,
                message: 'This field has to be equal to the email',
            },
        ],
        required: true,
    },
};
