import Form from './Form';
import Input from './Input';
import useAPIrequest from '@/hooks/useAPIrequest';
import useValidate from '@/hooks/useValidate';

interface SignInFormProps {
    setUser: (user: boolean) => void;
    hasUser: () => boolean;
}

export default function SignInForm({ setUser, hasUser }: SignInFormProps) {
    const { validateUsername, validatePassword, validateAllInputs } =
        useValidate(inputs);
    const { request } = useAPIrequest();

    return (
        <div className="o-sign-in-form">
            <div className="c-container">
                <Form
                    inputs={inputs}
                    validateAllInputs={validateAllInputs}
                    legend="SignIn"
                    setUser={setUser}
                    hasUser={() => hasUser()}
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
                </Form>
            </div>
        </div>
    );

    async function requestApi<T>(formContent: T) {
        const action = process.env.NEXT_PUBLIC_SIGN_IN_LINK as string;
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
