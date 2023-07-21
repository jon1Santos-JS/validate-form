import Form from '../Form';
import Input from '../Input';
import { useRouter } from 'next/router';
import InputsHandler from '../InputsHandler';

interface SignUpFormPropsType {
    setResponse: (data: boolean) => void;
}

export default function SignUpForm({ setResponse }: SignUpFormPropsType) {
    const router = useRouter();

    return (
        <div className="o-sign-up-form">
            <div className="c-container">
                <InputsHandler preInputs={preInputs}>
                    <Form legend="SignUp" onSubmitInputs={onSubmitInputs}>
                        <Input
                            label="Username"
                            inputType="text"
                            fieldName="username"
                            attributes={['value']}
                        />
                        <Input
                            label="Password"
                            inputType="password"
                            fieldName="password"
                            attributes={['value']}
                        />
                        <Input
                            label="Confirm Password"
                            inputType="password"
                            fieldName="confirmPassword"
                            attributes={['value']}
                        />
                    </Form>
                </InputsHandler>
            </div>
        </div>
    );

    async function onSubmitInputs<T>(inputs: T) {
        const action = process.env.NEXT_PUBLIC_SIGN_UP_LINK as string;
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputs),
        };
        const response = await fetch(action, options);
        const parsedResponse: ServerResponse = await response.json();
        if (typeof parsedResponse.serverResponse === 'string') return;
        if (parsedResponse.serverResponse) {
            router.push('/');
            return;
        }
        setResponse(true);
    }
}

const preInputs = {
    username: {
        validations: (currentInputValue: string) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Username must has 6 characters at least',
            },
            {
                coditional: !currentInputValue.match(/^[A-Za-z]+$/),
                message: 'Only characters',
            },
        ],
        required: true,
    },
    password: {
        validations: (
            currentInputValue: string,
            formInputs: PreFormInputsType,
        ) => [
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
        required: true,
    },
    confirmPassword: {
        validations: (
            currentInputValue: string,
            formInputs: PreFormInputsType,
        ) => [
            {
                coditional: currentInputValue !== formInputs['password'].value,
                message: 'This field has to be equal to the password',
            },
        ],
        required: true,
    },
};
