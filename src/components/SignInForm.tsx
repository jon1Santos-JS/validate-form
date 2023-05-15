import useValidate from '@/hooks/useValidate';
import Form from './Form';
import Input from './Input';
import { useState } from 'react';

export default function SignInForm() {
    const { validateUsername, validatePassword, validateAllInputs } =
        useValidate(inputs);
    const [dbData, setDbData] = useState<DBResponseForm>(null);

    return (
        <div className="o-sign-in-form">
            <div className="c-container">
                <Form
                    inputs={inputs}
                    validateAllInputs={validateAllInputs}
                    method="POST"
                    action={process.env.NEXT_PUBLIC_SIGN_IN_LINK as string}
                    legend="SignIn"
                    getUser={(data) => setDbData(data)}
                >
                    <Input
                        label="Username"
                        inputType="text"
                        validation={validateUsername}
                    />
                    <Input
                        label="Password"
                        inputType="password"
                        validation={validatePassword}
                    />
                </Form>
            </div>
            <button
                className="button is-primary"
                onClick={() => {
                    if (typeof dbData !== 'string' && dbData !== null)
                        console.log(dbData);
                }}
            >
                GETDB
            </button>
            <button
                className="button is-primary"
                onClick={() => onFetchDBApi('DELETE')}
            >
                DELETEDB
            </button>
        </div>
    );
}

function onFetchDBApi(method: 'DELETE' | 'GET' | 'POST') {
    return fetch(process.env.NEXT_PUBLIC_HANDLE_DB_LINK as string, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const inputs: FormInputsType = {
    username: {
        validations: (currentInputValue: string) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Username must has 6 characters at least',
            },
            {
                coditional: !currentInputValue.match(/\D/),
                message: 'Only strings',
            },
        ],
        errors: [],
        isEmpty: true,
    },
    password: {
        validations: (currentInputValue) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password must has 6 characters at least',
            },
        ],
        errors: [],
        isEmpty: true,
    },
};
