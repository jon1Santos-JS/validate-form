import useValidate from '@/hooks/useValidate';
import Form from './Form';
import Input from './Input';

const inputs: FormInputsType = {
    username: { errors: [], isEmpty: true },
    password: { errors: [], isEmpty: true },
};

export default function SignInForm() {
    const { validateUsername, validatePassword, validateAllInputs } =
        useValidate(inputs);
    return (
        <div className="o-sign-in-form">
            <div className="c-container">
                <Form
                    inputs={inputs}
                    validateAllInputs={validateAllInputs}
                    method="POST"
                    action={process.env.NEXT_PUBLIC_SIGN_IN_LINK as string}
                    legend="SignIn"
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
                onClick={() => onFetchDBApi('GET')}
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
