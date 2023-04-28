import useValidate from '@/hooks/useValidate';
import Form, { FormInputTypesToValidate } from './Form';
import Input from './Input';

const fields: FormInputTypesToValidate = {
    username: { errors: [], isEmpty: true },
    password: { errors: [], isEmpty: true },
};

export default function SignInForm() {
    const { validateUsername, validatePassword } = useValidate(fields);
    return (
        <div className="o-sign-in-form">
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
                </Form>
            </div>
        </div>
    );
}
