import useValidate from '@/hooks/useValidate';
import Form, { FormInputTypesToValidate } from './Form';
import Input from './Input';

const fields: FormInputTypesToValidate = {
    username: { errors: [], isEmpty: true },
    password: { errors: [], isEmpty: true },
    confirmPassword: { errors: [], isEmpty: true },
};

export default function SignUpForm() {
    const { validateUsername, validatePassword, cofirmPassword } =
        useValidate(fields);
    return (
        <div className="o-sign-up-form">
            <div className="c-container">
                <Form fields={fields}>
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
