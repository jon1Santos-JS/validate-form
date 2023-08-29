import { InputsHandledContext } from '@/context/InputsHandlerContext';
import Form from '../Form';
import Input from '../Input';
import { useContext } from 'react';

interface SignUpFormPropsType {
    setResponse: (data: boolean) => void;
}

export default function SignUpForm({ setResponse }: SignUpFormPropsType) {
    const { onChangeInput } = useContext(InputsHandledContext);

    return (
        <div className="o-sign-up-form">
            <div className="c-container">
                <Form legend="SignUp" onSubmitInputs={onSubmitInputs}>
                    <Input
                        label="Username"
                        inputType="text"
                        onChange={onchangeUsername}
                        objectifiedName="username"
                    />
                    <Input
                        label="Password"
                        inputType="password"
                        onChange={onchangePassword}
                        objectifiedName="password"
                    />
                    <Input
                        label="Confirm Password"
                        inputType="password"
                        onChange={onchangeConfirmPassword}
                        objectifiedName="confirmPassword"
                    />
                </Form>
            </div>
        </div>
    );

    function onchangeUsername(e: React.ChangeEvent<HTMLInputElement>) {
        onChangeInput({
            objectifiedName: 'username',
            targetProp: 'value',
            value: e.target.value,
        });
    }

    function onchangePassword(e: React.ChangeEvent<HTMLInputElement>) {
        onChangeInput({
            objectifiedName: 'password',
            targetProp: 'value',
            value: e.target.value,
        });
    }

    function onchangeConfirmPassword(e: React.ChangeEvent<HTMLInputElement>) {
        onChangeInput({
            objectifiedName: 'confirmPassword',
            targetProp: 'value',
            value: e.target.value,
        });
    }

    async function onSubmitInputs(
        handledInputs: FormHandledInputsType<
            keyof typeof SIGN_UP_FORM_INPUTS_STATE
        >,
    ) {
        const action = process.env.NEXT_PUBLIC_SIGN_UP_LINK as string;
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledInputs),
        };
        const response = await fetch(action, options);
        const parsedResponse: ServerResponse = await response.json();
        if (typeof parsedResponse.serverResponse === 'string') return;
        if (parsedResponse.serverResponse) {
            window.location.assign('/'); // USING ASSIGN JUST FOR THE SIMULATION
            return;
        }
        setResponse(true);
    }
}

type SignUpInputs = 'username' | 'password' | 'confirmPassword';

export const SIGN_UP_FORM_INPUTS_STATE: PreFormInputsType<SignUpInputs> = {
    username: {
        validations: (currentInputValue) => [
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
