import { useState } from 'react';
import Input from './Input';
import { useRouter } from 'next/router';
import { omitFields, preventCompareEmptyField } from '@/hooks/useInputsHandler';
import useValidate from '@/hooks/useValidate';

const API = 'api/changePassword';
const FIELDS_TO_OMIT: (keyof ValidateInputType<string>)[] = [
    'errors',
    'required',
    'validations',
];

type ChangePasswordFormPropsTypes = {
    handleUserProps: HandleUserPropsType;
};

type InputsType = 'password' | 'newPassword' | 'confirmNewPassword';

export default function ChangePasswordForm({
    handleUserProps,
}: ChangePasswordFormPropsTypes) {
    const router = useRouter();
    const { user } = handleUserProps;
    const [showMessage, onShowMessage] = useState<boolean>(false);
    const { uniqueValidation, manyValidation } = useValidate();
    const [isButtonClickable, setClickableButton] = useState(true);
    const [inputState, setInputState] = useState({
        password: {
            isControlledFromOutside: false,
            showInputMessage: false,
            highlightInput: false,
            onShowInputMessage: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    password: { ...prev.password, showInputMessage: value },
                })),
            onHighlightInput: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    password: { ...prev.password, highlightInput: value },
                })),
            setControlledFromOutside: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    password: {
                        ...prev.password,
                        isControlledFromOutside: value,
                    },
                })),
        },
        newPassword: {
            isControlledFromOutside: false,
            showInputMessage: false,
            highlightInput: false,
            onShowInputMessage: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    newPassword: {
                        ...prev.newPassword,
                        showInputMessage: value,
                    },
                })),
            onHighlightInput: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    newPassword: { ...prev.newPassword, highlightInput: value },
                })),
            setControlledFromOutside: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    newPassword: {
                        ...prev.newPassword,
                        isControlledFromOutside: value,
                    },
                })),
        },
        confirmNewPassword: {
            isControlledFromOutside: false,
            showInputMessage: false,
            highlightInput: false,
            onShowInputMessage: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    confirmNewPassword: {
                        ...prev.confirmNewPassword,
                        showInputMessage: value,
                    },
                })),
            onHighlightInput: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    confirmNewPassword: {
                        ...prev.confirmNewPassword,
                        highlightInput: value,
                    },
                })),
            setControlledFromOutside: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    confirmNewPassword: {
                        ...prev.confirmNewPassword,
                        isControlledFromOutside: value,
                    },
                })),
        },
    });
    const [inputs, setInputs] = useState(INPUTS_INITIAL_STATE);

    return <>{renderContent()}</>;

    function renderContent() {
        if (
            user.username ===
            (process.env.NEXT_PUBLIC_ADMINS_USERNAME as string)
        )
            return null;

        return (
            <form className="o-change-password-form">
                <fieldset className="container">
                    <div className="legend">
                        <legend>Change Password</legend>
                    </div>
                    <div className="inputs">
                        <Input
                            ownProps={{
                                label: 'Password',
                                inputType: 'password',
                                onChange: (e) => onChange(e, 'password'),
                            }}
                            inputStateProps={{
                                input: uniqueValidation(inputs.password),
                                inputState: inputState.password,
                            }}
                        />
                        <Input
                            ownProps={{
                                label: 'New Password',
                                inputType: 'password',
                                onChange: (e) => onChange(e, 'newPassword'),
                            }}
                            inputStateProps={{
                                input: uniqueValidation(
                                    inputs.newPassword,
                                    inputs,
                                ),
                                inputState: inputState.newPassword,
                            }}
                        />
                        <Input
                            ownProps={{
                                label: 'Confirm New Password',
                                inputType: 'password',
                                onChange: (e) =>
                                    onChange(e, 'confirmNewPassword'),
                            }}
                            inputStateProps={{
                                input: uniqueValidation(
                                    inputs.confirmNewPassword,
                                    inputs,
                                ),
                                inputState: inputState.confirmNewPassword,
                            }}
                        />
                    </div>
                    <div>
                        <button
                            key={'submitButton'}
                            className="c-button"
                            onClick={onClick}
                        >
                            Submit
                        </button>
                    </div>
                </fieldset>
            </form>
        );
    }

    function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        name: keyof typeof inputs,
    ) {
        setInputs((prev) => ({
            ...prev,
            [name]: { ...prev[name], value: e.target.value },
        }));
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (showMessage) return; // WAITING THE MESSAGE GOES DOWN TO REQUEST
        if (manyValidation(inputs)) {
            if (!isButtonClickable) return;
            setClickableButton(false);
            await onSubmitInputs();
        }
        for (const i in inputState) {
            const typedIndex = i as InputsType;
            inputState[typedIndex].onHighlightInput(true);
            inputState[typedIndex].onShowInputMessage(true);
            inputState[typedIndex].setControlledFromOutside(true);
        }
        onShowMessage(true);
        setClickableButton(true);
    }

    async function onSubmitInputs() {
        const handledBody = {
            username: { value: user.username },
            ...omitFields(inputs, FIELDS_TO_OMIT),
        };
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledBody),
        };
        const response = await fetch(API, options);
        const parsedResponse: ServerResponse = await response.json();
        if (!parsedResponse.serverResponse) return;
        for (const i in inputState) {
            const typedIndex = i as InputsType;
            inputState[typedIndex].onShowInputMessage(true);
            inputState[typedIndex].setControlledFromOutside(true);
        }
        onShowMessage(false);
        router.reload();
    }
}

const INPUTS_INITIAL_STATE: InputsToValidateType<InputsType> = {
    password: {
        validations: (currentInputValue) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password incorrect',
            },
        ],
        required: 'Password incorrect',
        value: '',
        errors: [],
    },
    newPassword: {
        validations: (currentInputValue, inputs) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password must has 6 characters at least',
            },
            {
                coditional: currentInputValue === inputs?.password.value,
                message: 'This field have to be different than the password',
            },
            {
                coditional: preventCompareEmptyField(
                    currentInputValue !== inputs?.confirmNewPassword.value,
                    inputs?.confirmNewPassword.value,
                ),
                message:
                    'This field has to be equal to the confirm new password',
            },
        ],
        required: 'New password incorrect',
        value: '',
        errors: [],
    },
    confirmNewPassword: {
        validations: (currentInputValue, hookInputs) => [
            {
                coditional: currentInputValue !== hookInputs?.newPassword.value,
                message: 'This field has to be equal to the new password',
            },
        ],
        required: 'Confirm new password incorrect',
        value: '',
        errors: [],
    },
};
