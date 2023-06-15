import { useRouter } from 'next/router';
import Form from './Form';
import Input from './Input';
import useValidate from '@/hooks/useValidate';

interface SignInFormProps {
    setUser: SetUserType;
    hasUser: HasUserType;
}

export default function SignInForm({ setUser }: SignInFormProps) {
    const { validateUsername, validatePassword, validateAllInputs } =
        useValidate(inputs);
    const router = useRouter();

    return (
        <div className="o-sign-in-form">
            <div className="c-container">
                <Form
                    inputs={inputs}
                    haveInputsErrors={validateAllInputs}
                    legend="SignIn"
                    onSubmitInputs={onSubmitInputs}
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

    async function onSubmitInputs<T>(formContent: T) {
        const action = process.env.NEXT_PUBLIC_SIGN_IN_LINK as string;
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formContent),
        };
        const response = await fetch(action, options);
        const parsedResponse: ServerResponse = await response.json();
        if (typeof parsedResponse.serverResponse === 'string') return;
        if (parsedResponse.serverResponse) router.push('/');
        setUser(parsedResponse.serverResponse);
    }
}

const inputs: PreFormInputsType = {
    username: {
        validations: (currentInputValue: string) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Username incorrect',
            },
        ],
        required: 'Username incorrect',
    },
    password: {
        validations: (currentInputValue) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password incorrect',
            },
        ],
        required: 'Password incorrect',
    },
};
