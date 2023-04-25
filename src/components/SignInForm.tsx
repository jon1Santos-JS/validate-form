import useValidate from '@/hooks/useValidate';
import Form, { FormInputTypesToValidate } from './Form';
import Input from './Input';

const fields: FormInputTypesToValidate = {
    username: { input: '', errors: [], isEmpty: true },
    password: { input: '', errors: [], isEmpty: true },
};

export default function SignInForm() {
    const { validateUsername, validatePassword } = useValidate(fields);
    return (
        <div className="o-sign-in-form">
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
                </Form>
            </div>
        </div>
    );
}
