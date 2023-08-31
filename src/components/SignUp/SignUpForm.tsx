import Form from '../Form';
import Input from '../Input';

interface SignUpFormPropsType {
    ownProps: PropsType;
    handleUserProps: HandleUserPropsType;
    handleInputsProps: HandleInputsPropsType<SignUpInputs>;
}
export type SignUpInputs = 'username' | 'password' | 'confirmPassword';

interface PropsType {
    setResponse: (data: boolean) => void;
}

export default function SignUpForm({
    ownProps,
    handleInputsProps,
}: SignUpFormPropsType) {
    const { onChangeInput } = handleInputsProps;
    const { setResponse } = ownProps;

    return (
        <div className="o-sign-up-form">
            <div className="c-container">
                <Form
                    ownProps={{
                        legend: 'SignUp',
                        onSubmitInputs: onSubmitInputs,
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
                    <Input
                        ownProps={{
                            label: 'Confirm Password',
                            inputType: 'password',
                            objectifiedName: 'confirmPassword',
                            onChange: (e) => onChange(e, 'confirmPassword'),
                        }}
                        handleInputsProps={handleInputsProps}
                    />
                </Form>
            </div>
        </div>
    );

    function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        name: SignUpInputs,
    ) {
        onChangeInput({
            objectifiedName: name,
            targetProp: 'value',
            value: e.target.value,
        });
    }

    async function onSubmitInputs(
        handledInputs: FormHandledInputsType<SignUpInputs>,
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
            // window.location.assign('/'); // USING ASSIGN JUST FOR THE SIMULATION
            return;
        }
        setResponse(true);
    }
}

export const SIGN_UP_FORM_INPUTS_STATE: PreFormInputsType<SignUpInputs> = {
    username: {
        validations: (currentInputValue) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Username must has 6 characters at least',
            },
            {
                coditional: !currentInputValue.match(/^[A-Za-zçÇ]+$/),
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
