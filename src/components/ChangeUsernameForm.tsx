import { useState } from 'react';
import Input from './Input';
import useValidate from '@/hooks/useValidate';
import { useUser } from '../context/UserContext';
import useInputHandler from '@/hooks/useInputHandler';
import useUtils from '@/hooks/useUtils';
import { useRouter } from 'next/router';
const UPDATE_USERNAME_API = 'api/updateUsername';
const CHECK_USERNAME_API = 'api/checkUsername';

type InputsType = 'newUsername' | 'password';

export default function ChangeUsernameForm() {
    const router = useRouter();
    const { user } = useUser();
    const { asyncValidateSingle, validateMany, validateSingle } = useValidate();
    const { inputsFactory, onCheckUsername } = useInputHandler();
    const { onSetTimeOut, onSetAsyncTimeOut } = useUtils();
    const [isClickable, handleClickButton] = useState(true);
    const [inputState, setInputState] = useState({
        newUsername: { showInputMessage: false, highlightInput: false },
        password: { showInputMessage: false, highlightInput: false },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        newUsername: inputsFactory({
            asyncValidations: async ({ value }) => [
                {
                    conditional: await onCheckUsername(CHECK_USERNAME_API, {
                        method: 'POST',
                        body: value,
                    }),
                    message: 'This username already exist',
                },
            ],
            validations: ({ value }) => [
                {
                    conditional: !value.match(/.{6,}/),
                    message: 'Username must has 6 characters at least',
                },
                {
                    conditional: !value.match(/^[A-Za-zçÇ]+$/),
                    message: 'Only characters',
                },
            ],
            required: { value: true },
            attributes: { value: '' },
            errors: [],
        }),
        password: inputsFactory({
            validations: ({ value }) => [
                {
                    conditional: !value.match(/.{6,}/),
                    message: 'Incorrect Password',
                },
            ],
            required: { value: true },
            attributes: { value: '' },
            errors: [],
        }),
    });

    return <>{renderContent()}</>;

    function renderContent() {
        if (
            user.username ===
            (process.env.NEXT_PUBLIC_ADMINS_USERNAME as string)
        )
            return null;

        return (
            <form className="o-change-username-form">
                <fieldset className="container">
                    <div className="legend">
                        <legend>Change Username</legend>
                    </div>
                    <div className="inputs">
                        <Input
                            ownProps={{
                                label: 'New Username',
                                inputType: 'text',
                                onChange: (e) => onChange(e, 'newUsername'),
                            }}
                            inputStateProps={{
                                input: inputs.newUsername,
                                inputState: inputState.newUsername,
                            }}
                        />
                        <Input
                            ownProps={{
                                label: 'Password',
                                inputType: 'password',
                                onChange: (e) => onChangePassword(e),
                            }}
                            inputStateProps={{
                                input: inputs.password,
                                inputState: inputState.password,
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

    async function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        key: InputsType,
    ) {
        setInputs((prev) => ({
            ...prev,
            [key]: { ...prev[key], attributes: { value: e.target.value } },
        }));
        handleClickButton(false);
        await onSetAsyncTimeOut(async () => {
            const validatedInput = await asyncValidateSingle({
                ...inputs[key],
                attributes: { value: e.target.value },
            });
            setInputs((prev) => ({ ...prev, [key]: validatedInput }));
            setInputState((prev) => ({
                ...prev,
                newUsername: {
                    ...prev.newUsername,
                    highlightInput: true,
                    showInputMessage: true,
                },
                password: {
                    ...prev.newUsername,
                    highlightInput: true,
                    showInputMessage: true,
                },
            }));
        }, 950);
        handleClickButton(true);
    }

    function onChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
        setInputs((prev) => ({
            ...prev,
            password: {
                ...prev.password,
                attributes: { value: e.target.value },
            },
        }));
        handleClickButton(false);
        onSetTimeOut(() => {
            setInputs((prev) => ({
                ...prev,
                password: validateSingle({
                    ...prev.password,
                    attributes: { value: e.target.value },
                }),
            }));
            setInputState((prev) => ({
                ...prev,
                newUsername: {
                    ...prev.newUsername,
                    highlightInput: true,
                    showInputMessage: true,
                },
                password: {
                    ...prev.newUsername,
                    highlightInput: true,
                    showInputMessage: true,
                },
            }));
            handleClickButton(true);
        }, 950);
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (!isClickable) return;
        if (!validateMany(inputs)) {
            setInputState((prev) => ({
                ...prev,
                newUsername: {
                    ...prev.newUsername,
                    highlightInput: true,
                    showInputMessage: true,
                },
                password: {
                    ...prev.newUsername,
                    highlightInput: true,
                    showInputMessage: true,
                },
            }));
            return;
        }
        handleClickButton(false);
        const handledInputs = onHandleInputs(inputs, user.username);
        const response = await onSubmitInputs(handledInputs);
        if (!response.success) {
            setInputState((prev) => ({
                ...prev,
                newUsername: {
                    ...prev.newUsername,
                    showInputMessage: true,
                },
                password: {
                    ...prev.password,
                    highlightInput: true,
                    showInputMessage: true,
                },
            }));
            handleClickButton(true);
            return;
        }
        router.reload();
    }

    function onHandleInputs(
        inputsToHandle: InputsToValidateType<InputsType>,
        username: string,
    ) {
        const { newUsername, password } = inputsToHandle;
        return {
            username: { value: username },
            newUsername: { value: newUsername.attributes.value },
            password: { value: password.attributes.value },
        };
    }

    async function onSubmitInputs(handledInputs: UserWithNewUsername) {
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledInputs),
        };
        const response = await fetch(UPDATE_USERNAME_API, options);
        const parsedResponse: DBDefaultResponse = await response.json();
        return parsedResponse;
    }
}
