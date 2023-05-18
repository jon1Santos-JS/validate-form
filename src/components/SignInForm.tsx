import useValidate from '@/hooks/useValidate';
import Form from './Form';
import Input from './Input';

interface SignInFormProps {
    setUser: (user: boolean) => void;
    hasUser?: () => boolean;
}

export default function SignInForm({ setUser, hasUser }: SignInFormProps) {
    const { validateUsername, validatePassword, validateAllInputs } =
        useValidate(inputs);

    return (
        <div className="o-sign-in-form">
            <div className="c-container">
                <Form
                    inputs={inputs}
                    validateAllInputs={validateAllInputs}
                    method="POST"
                    action={process.env.NEXT_PUBLIC_SIGN_IN_LINK as string}
                    legend="SignIn"
                    setUser={setUser}
                    hasUser={hasUser}
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
};
