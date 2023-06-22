import { useRouter } from 'next/router';
import Form from './Form';
import Input from './Input';
import InputsHandler from './InputsHandler';

type SignInFormProps = HandlerUserStateProps;

export default function SignInForm({ setUser, setHasUser }: SignInFormProps) {
    const router = useRouter();

    return (
        <div className="o-sign-in-form">
            <div className="c-container">
                <InputsHandler preInputs={preInputs}>
                    <Form legend="SignIn" onSubmitInputs={onSubmitInputs}>
                        <Input
                            label="Username"
                            inputType="text"
                            fieldName="username"
                        />
                        <Input
                            label="Password"
                            inputType="password"
                            fieldName="password"
                        />
                    </Form>
                </InputsHandler>
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
        if (typeof parsedResponse.serverResponse !== 'string') {
            setHasUser(false);
            return;
        }
        if (parsedResponse.serverResponse) router.push('/dashboard-page');
        setHasUser(true);
        setUser(parsedResponse.serverResponse);
    }
}

const preInputs: PreFormInputsType = {
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
