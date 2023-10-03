import { useState } from 'react';
import Form, { ElementsToAddProps } from '../Form';
import Input from '../Input';
import { omitFields, preventCompareEmptyField } from '@/hooks/useInputsHandler';
import { onOmitProps } from '@/lib/lodashAdapter';
import Link from 'next/link';
import useValidate from '@/hooks/useValidate';

const API = 'api/signUp';
const INPUTS_TO_OMIT = ['confirmPassword'] as InputsType[];
const FIELDS_TO_OMIT: (keyof ValidateInputType<string>)[] = [
    'errors',
    'required',
    'validations',
];

interface SignUpFormPropsType {
    ownProps: PropsType;
    handleUserProps: HandleUserPropsType;
}

interface PropsType {
    setModalState: (data: boolean) => void;
}

type InputsType = 'confirmPassword' | 'password' | 'username';

export default function SignUpForm({
    ownProps,
    handleUserProps,
}: SignUpFormPropsType) {
    const { setModalState } = ownProps;
    const { hasUser } = handleUserProps;
    const [inputs, setInputs] = useState(INPUTS_INITIAL_STATE);
    const [showInputsMessage, setShowInputsMessage] = useState(false);
    const [highlightInputClass, setHighlightInputsClass] = useState(false);
    const { uniqueValidation, manyValidation } = useValidate();

    // useEffect(() => {
    //     console.log(inputs);
    // }, [inputs]);

    return (
        <Form
            ownProps={{
                legend: 'Sign up',
                onSubmitInputs: onSubmitInputs,
                elementsToAdd: elementsToAddFn,
                className: 'o-sign-up-form',
                formError: null,
            }}
            validateProps={{
                areInputsValid: () => manyValidation(inputs),
                onShowInputsMessage,
                setHighlightInputsClass,
            }}
        >
            <Input
                ownProps={{
                    label: 'Username',
                    inputType: 'text',
                    onChange: (e) => onChange(e, 'username'),
                }}
                validateProps={{
                    input: uniqueValidation(inputs.username),
                    showInputMessagesFromOutside: showInputsMessage,
                    highLightInputFromOutside: highlightInputClass,
                }}
            />
            <Input
                ownProps={{
                    label: 'Password',
                    inputType: 'password',
                    onChange: (e) => onChange(e, 'password'),
                }}
                validateProps={{
                    input: uniqueValidation(
                        inputs.password,
                        inputs.confirmPassword,
                    ),
                    showInputMessagesFromOutside: showInputsMessage,
                    highLightInputFromOutside: highlightInputClass,
                }}
            />
            <Input
                ownProps={{
                    label: 'Confirm Password',
                    inputType: 'password',
                    onChange: (e) => onChange(e, 'confirmPassword'),
                }}
                validateProps={{
                    input: uniqueValidation(
                        inputs.confirmPassword,
                        inputs.password,
                    ),
                    showInputMessagesFromOutside: showInputsMessage,
                    highLightInputFromOutside: highlightInputClass,
                }}
            />
        </Form>
    );

    function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        name: keyof typeof inputs,
    ) {
        setInputs((prev) => ({
            ...prev,
            [name]: { ...prev[name], value: e.target.value },
        }));
    }

    function onShowInputsMessage(value: boolean) {
        setShowInputsMessage(value);
    }

    async function onSubmitInputs() {
        const handledInputs = omitFields(
            onOmitProps(inputs, INPUTS_TO_OMIT) as InputsToValidateType<
                keyof typeof inputs
            >,
            FIELDS_TO_OMIT,
        );
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledInputs),
        };
        const response = await fetch(API, options);
        const parsedResponse: ServerResponse = await response.json();
        if (!parsedResponse.serverResponse) {
            setModalState(true);
            return;
        }
        window.location.assign('/'); // WINDOW.ASSIGN JUST FOR THE SIMULATION
    }

    function elementsToAddFn(props: ElementsToAddProps) {
        return (
            <div className="buttons">
                <button
                    key={'submitButton'}
                    className="c-button"
                    onClick={props.onClick}
                >
                    Submit
                </button>
                {!hasUser && (
                    <Link key={'signInButton'} href="/">
                        <button className="c-button">Sign In</button>
                    </Link>
                )}
            </div>
        );
    }
}

const INPUTS_INITIAL_STATE: InputsToValidateType<InputsType> = {
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
        value: '',
        errors: [],
    },
    password: {
        validations: (currentInputValue, conditionalInputValue) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password must has 6 characters at least',
            },
            {
                coditional: preventCompareEmptyField(
                    currentInputValue !== conditionalInputValue,
                    conditionalInputValue,
                ),
                message: 'This field has to be equal to the confirm password',
            },
        ],
        required: true,
        value: '',
        errors: [],
    },
    confirmPassword: {
        validations: (currentInputValue, conditionalInputValue) => [
            {
                coditional: currentInputValue !== conditionalInputValue,
                message: 'This field has to be equal to the password',
            },
        ],
        required: true,
        value: '',
        errors: [],
    },
};
