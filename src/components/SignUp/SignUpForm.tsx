import Form from '../Form';
import Input from '../Input';
import { useRouter } from 'next/router';
import InputHandler from '../InputHandler';

interface SignUpFormPropsType {
    setResponse: (data: boolean) => void;
}

export default function SignUpForm({ setResponse }: SignUpFormPropsType) {
    const router = useRouter();
    // CROSS VALIDATE INPUTS

    return (
        <div className="o-sign-up-form">
            <div className="c-container">
                <InputHandler inputs={inputs}>
                    <Form legend="SignUp" onSubmitInputs={onSubmitInputs}>
                        <Input
                            label="Username"
                            inputType="text"
                            fieldName="username"
                        />
                        <Input
                            label="Password"
                            inputType="text"
                            fieldName="password"
                        />
                        <Input
                            label="Confirm Password"
                            inputType="text"
                            fieldName="confirmPassword"
                        />
                    </Form>
                </InputHandler>
            </div>
        </div>
    );

    async function onSubmitInputs<T>(formContent: T) {
        const action = process.env.NEXT_PUBLIC_SIGN_UP_LINK as string;
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formContent),
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

const inputs: PreFormInputsType = {
    username: {
        validations: (currentInputValue) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Username must has 6 characters at least',
            },
        ],
        required: true,
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
        required: true,
    },
    confirmPassword: {
        validations: (currentInputValue, formInputs) => [
            {
                coditional: currentInputValue !== formInputs['password'].value,
                message: 'This field has to be equal to the password',
            },
        ],
        required: true,
    },
};
