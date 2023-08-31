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
    const { onChangeInput } = handleInputsProps;

    return (
        <div className="o-sign-in-form">
            <div className="c-container">
                <Form
                    ownProps={{
                        legend: 'SignIn',
                        onSubmitInputs: onSubmitInputs,
                        formDefaultError: SIGN_IN_ERROR_RESPONSE,
                        formSubmitError: SIGN_IN_ERROR_RESPONSE,
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
                    />
                    <Input
                        ownProps={{
                            label: 'Password',
                            inputType: 'password',
                            objectifiedName: 'password',
                            onChange: (e) => onChange(e, 'password'),
                        }}
                        handleInputsProps={handleInputsProps}
                    />
                </Form>
            </div>
        </div>
    );

    function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        name: SignInInputs,
    ) {
        onChangeInput({
            objectifiedName: name,
            targetProp: 'value',
            value: e.target.value,
        });
    }

    async function onSubmitInputs(
        handledInputs: FormHandledInputsType<SignInInputs>,
    ) {
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

export const SIGN_IN_FORM_STATE_INPUTS: PreFormInputsType<SignInInputs> = {
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
