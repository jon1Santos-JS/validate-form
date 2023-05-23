import Form from './Form';
import Input from './Input';
import useValidate from '@/hooks/useValidate';
import useAPIrequest from '@/hooks/useAPIrequest';

interface SignUpFormProps {
    setUser: (user: boolean) => void;
    hasUser: () => boolean;
}

export default function SignUpForm({ setUser, hasUser }: SignUpFormProps) {
    const {
        validateUsername,
        validatePassword,
        validateAllInputs,
        validateCofirmPassword,
    } = useValidate(inputs);
    const { request } = useAPIrequest();

    return (
        <div className="o-sign-up-form">
            <div className="c-container">
                <Form
                    inputs={inputs}
                    validateAllInputs={validateAllInputs}
                    legend="SignUp"
                    hasUser={hasUser}
                    setUser={setUser}
                    requestApi={requestApi}
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

    async function requestApi<T>(formContent: T) {
        const action = process.env.NEXT_PUBLIC_SIGN_UP_LINK as string;
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formContent),
        };
        return await request(action, options);
    }
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
        validations: (currentInputValue, formInputs) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password must has 6 characters at least',
            },
            {
                coditional:
                    currentInputValue !== formInputs['confirmPassword'].value,
                message: 'This field has to be equal to the confirm password',
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
