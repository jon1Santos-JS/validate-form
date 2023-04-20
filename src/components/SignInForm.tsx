import useValidate from '@/hooks/useValidate';
import Form from './Form';
import Input from './Input';

export default function SignInForm() {
    const { validateUsername, validatePassword, validate } = useValidate();
    return (
        <div className="o-sign-in-form">
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
                </Form>
            </div>
        </div>
    );
}
