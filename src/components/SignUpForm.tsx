import useValidate from '@/hooks/useValidate';
import Form from './Form';
import Input from './Input';

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

const inputs: FormInputsType = {
    username: {
        validations: (currentInputValue: string) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Username must has 6 characters at least',
            },
            {
                coditional: !currentInputValue.match(/\D/),
                message: 'Only strings',
            },
        ],
        errors: [],
        isEmpty: true,
    },
    password: {
        validations: (currentInputValue) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password must has 6 characters at least',
            },
        ],
        errors: [],
        isEmpty: true,
    },
    confirmPassword: {
        validations: (currentInputValue, formInputs) => [
            {
                coditional: currentInputValue !== formInputs['password'].value,
                message: 'This field has to be equal to the password',
            },
        ],
        errors: [],
        isEmpty: true,
    },
};
