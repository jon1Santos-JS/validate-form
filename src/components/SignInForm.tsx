import Form from './Form';
import Input from './Input';
import InputsHandler from './InputsHandler';

type SignInFormProps = HandlerUserStateProps;

const SIGN_IN_ERROR_RESPONSE = 'Incorrect username or password';

export default function SignInForm({
    setUser,
    setHasUser,
    setUserStateLoading,
}: SignInFormProps) {
    return (
        <div className="o-sign-in-form">
            <div className="c-container">
                <InputsHandler preInputs={preInputs}>
                    <Form
                        legend="SignIn"
                        onSubmitInputs={onSubmitInputs}
                        formDefaultError={SIGN_IN_ERROR_RESPONSE}
                        formSubmitError={SIGN_IN_ERROR_RESPONSE}
                    >
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
                    </Form>
                </InputsHandler>
            </div>
        </div>
    );

    async function onSubmitInputs<T>(inputs: T) {
        const action = process.env.NEXT_PUBLIC_SIGN_IN_LINK as string;
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputs),
        };
        const response = await fetch(action, options);
        const parsedResponse: ServerResponse = await response.json();
        setUserStateLoading(false);
        setHasUser(parsedResponse.serverResponse);
        if (!parsedResponse.serverResponse) {
            return SIGN_IN_ERROR_RESPONSE;
        }
        window.location.assign('/dashboard-page');
        setUser(parsedResponse.body);
    }
}

const preInputs = {
    username: {
        validations: (currentInputValue: string) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
            },
            {
                coditional: !currentInputValue.match(/^[A-Za-z]+$/),
            },
        ],
        required: true,
    },
    password: {
        validations: (currentInputValue: string) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
            },
        ],
        required: true,
    },
};
