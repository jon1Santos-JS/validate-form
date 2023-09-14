import { useState } from 'react';
import Form from './Form';
import Input from './Input';

type SignInFormProps = {
    handleUserProps: HandleUserPropsType;
    handleInputsProps: HandleInputsPropsType<SignInInputs>;
};
type SignInInputs = 'username' | 'password';

const SIGN_IN_ERROR_RESPONSE = 'Incorrect username or password';

export default function SignInForm({
    handleUserProps,
    handleInputsProps,
}: SignInFormProps) {
    const { setUser, setHasUser, setUserStateLoading } = handleUserProps;
    const { onChangeInput, handledInputs } = handleInputsProps;
    const [inputs, setInputs] = useState({
        username: { value: '' },
        password: { value: '' },
    });

    return (
        <div className="o-sign-in-form">
            <div className="c-container">
                <Form
                    ownProps={{
                        legend: 'SignIn',
                        onSubmitInputs: onSubmitInputs,
                        formError: SIGN_IN_ERROR_RESPONSE,
                    }}
                    handleInputsProps={handleInputsProps}
                >
                    <Input
                        ownProps={{
                            label: 'Username',
                            inputType: 'text',
                            objectifiedName: 'username',
                            onChange: (e) => onChange(e, 'username'),
                        }}
                        handleInputsProps={handleInputsProps}
                        validationProps={{
                            validations: (currentInputValue: string) => [
                                {
                                    coditional:
                                        !currentInputValue.match(/.{6,}/),
                                },
                                {
                                    coditional:
                                        !currentInputValue.match(/^[A-Za-z]+$/),
                                },
                            ],
                            required: true,
                            value: inputs.username.value,
                        }}
                    />
                    <Input
                        ownProps={{
                            label: 'Password',
                            inputType: 'password',
                            objectifiedName: 'password',
                            onChange: (e) => onChange(e, 'password'),
                        }}
                        handleInputsProps={handleInputsProps}
                        validationProps={{
                            validations: (currentInputValue: string) => [
                                {
                                    coditional:
                                        !currentInputValue.match(/.{6,}/),
                                },
                            ],
                            required: true,
                            value: inputs.password.value,
                        }}
                    />
                </Form>
            </div>
        </div>
    );

    function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        name: SignInInputs,
    ) {
        setInputs((prev) => {
            const newObj = { ...prev, [name]: { value: e.target.value } };
            return { ...newObj };
        });
    }

    async function onSubmitInputs() {
        const action = process.env.NEXT_PUBLIC_SIGN_IN_LINK as string;
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledInputs),
        };
        const response = await fetch(action, options);
        const parsedResponse: ServerResponse = await response.json();
        setUserStateLoading(false);
        setHasUser(parsedResponse.serverResponse);
        if (!parsedResponse.serverResponse) {
            return SIGN_IN_ERROR_RESPONSE;
        }
        window.location.assign('/dashboard-page');
        setUser({ username: parsedResponse.body as string });
    }
}
