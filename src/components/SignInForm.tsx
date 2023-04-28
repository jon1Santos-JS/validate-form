import useValidate from '@/hooks/useValidate';
import Form, { FormInputTypesToValidate } from './Form';
import Input from './Input';

const inputs: FormInputTypesToValidate = {
    username: { errors: [], isEmpty: true },
    password: { errors: [], isEmpty: true },
};

export default function SignInForm() {
    const { validateUsername, validatePassword, validateAll } =
        useValidate(inputs);
    return (
        <div className="o-sign-in-form">
            <div className="c-container">
                <Form
                    inputs={inputs}
                    validateAll={validateAll}
                    method="POST"
                    action="/api/hello"
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
        </div>
    );
}
