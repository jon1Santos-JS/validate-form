import useValidate from '@/hooks/useValidate';
import Form, { FormInputTypesToValidate } from './Form';
import Input from './Input';

const fields: FormInputTypesToValidate = {
    username: { input: '', errors: [], isEmpty: true },
    password: { input: '', errors: [], isEmpty: true },
    confirmPassword: { input: '', errors: [], isEmpty: true },
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
                        typeInput="text"
                        validation={validateUsername}
                    />
                    <Input
                        label="Password"
                        typeInput="password"
                        validation={validatePassword}
                    />
                    <Input
                        label="Confirm Password"
                        typeInput="password"
                        validation={cofirmPassword}
                    />
                </Form>
            </div>
        </div>
    );
}
