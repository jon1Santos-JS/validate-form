import useValidate from '@/hooks/useValidate';
import Form from './Form';
import Input from './Input';

export default function SignUpForm() {
    const { validateUsername, validatePassword, cofirmPassword, validate } =
        useValidate();
    return (
        <div className="o-sign-up-form">
            <div className="c-container">
                <Form validate={validate}>
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
