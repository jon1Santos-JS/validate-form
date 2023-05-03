import useValidate from '@/hooks/useValidate';
import Form from './Form';
import Input from './Input';

const inputs: InputsType = {
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
                    action={process.env.NEXT_PUBLIC_SERVER_LINK as string}
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
