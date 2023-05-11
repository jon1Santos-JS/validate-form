import useValidate from '@/hooks/useValidate';
import Form from './Form';
import Input from './Input';

const inputs: FormInputsType = {
    username: { errors: [], isEmpty: true },
    password: { errors: [], isEmpty: true },
    confirmPassword: { errors: [], isEmpty: true },
};

export default function SignUpForm() {
    const {
        validateUsername,
        validatePassword,
        validateAllInputs,
        validateCofirmPassword,
    } = useValidate(inputs);

    return (
        <div className="o-sign-up-form">
            <div className="c-container">
                <Form
                    inputs={inputs}
                    validateAllInputs={validateAllInputs}
                    method="POST"
                    action={process.env.NEXT_PUBLIC_SIGN_UP_LINK as string}
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
                        validation={validateCofirmPassword}
                    />
                </Form>
            </div>
        </div>
    );
}
