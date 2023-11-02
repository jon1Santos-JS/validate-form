import { useState } from 'react';
import Input from './Input';
import { useRouter } from 'next/router';
import useValidate from '@/hooks/useValidate';
import { useUser } from '../context/UserContext';
import useInputHandler from '@/hooks/useInputHandler';
const API = 'api/changeUsername';

type InputsType = 'newUsername';

export default function ChangeUsernameForm() {
    const router = useRouter();
    const { user } = useUser();
    const { asyncValidateSingle, validateMany } = useValidate();
    const { onSetTimeOut, inputsFactory, onCheckUsername } = useInputHandler();
    const [isClickable, handleButtonClick] = useState(true);
    const [inputState, setInputState] = useState({
        newUsername: { showInputMessage: false, highlightInput: false },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        newUsername: inputsFactory({
            asyncValidations: async (currentInputValue: string) => [
                {
                    conditional: await onCheckUsername(currentInputValue),
                    message: 'This username already exist',
                },
            ],
            validations: (currentInputValue: string) => [
                {
                    conditional: currentInputValue === user.username,
                    message: 'This is your currently username',
                },
                {
                    conditional: !currentInputValue.match(/.{6,}/),
                    message: '',
                },
                {
                    conditional: !currentInputValue.match(/^[A-Za-zçÇ]+$/),
                    message: '',
                },
            ],
            required: true,
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

    function onChange(e: React.ChangeEvent<HTMLInputElement>, key: InputsType) {
        handleButtonClick(false);
        setInputs((prev) => ({
            ...prev,
            [key]: { ...prev[key], value: e.target.value },
        }));
        onSetTimeOut(async () => {
            const validatedInput = await asyncValidateSingle({
                ...inputs[key],
                value: e.target.value,
            });
            setInputs((prev) => ({ ...prev, [key]: validatedInput }));
            handleButtonClick(true);
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
            }));
            return;
        }
        handleButtonClick(false);
        onHandleResponse(await onSubmitInputs());
        handleButtonClick(true);
    }

    function onHandleResponse(response: ServerResponse) {
        if (!response.serverResponse) return;
        setInputState((prev) => ({
            ...prev,
            newUsername: { ...prev.newUsername, showInputMessage: true },
        }));
        router.reload();
    }

    async function onSubmitInputs() {
        const handledBody = {
            username: { value: user.username },
            newUsername: { value: inputs.newUsername.value },
        };
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledBody),
        };
        const response = await fetch(API, options);
        const parsedResponse: ServerResponse = await response.json();
        return parsedResponse;
    }
}
