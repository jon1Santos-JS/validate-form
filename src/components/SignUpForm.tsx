import useValidate from '@/hooks/useValidate';
import Form, { FormInputTypesToValidate } from './Form';
import Input from './Input';

const inputs: FormInputTypesToValidate = {
    username: { errors: [], isEmpty: true },
    password: { errors: [], isEmpty: true },
    confirmPassword: { errors: [], isEmpty: true },
};

export default function SignUpForm() {
    const { validateUsername, validatePassword, cofirmPassword, validateAll } =
        useValidate(inputs);

    return (
        <div className="o-sign-up-form">
            <div className="c-container">
                <Form
                    inputs={inputs}
                    validateAll={validateAll}
                    method="POST"
                    action="/api/hello"
                    legend="SignUp"
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
                    <Input
                        label="Confirm Password"
                        inputType="password"
                        validation={cofirmPassword}
                    />
                </Form>
            </div>
        </div>
    );
}
