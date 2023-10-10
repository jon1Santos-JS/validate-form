import { useState } from 'react';
import Input from './Input';
import { useRouter } from 'next/router';
import useValidate from '@/hooks/useValidate';
const API = 'api/changeUsername';

const DEFAULT_MESSAGE = 'Invalid username';

type OwnPropsType = {
    ownProps: ChangeUsernameFormPropsTypes;
};

type ChangeUsernameFormPropsTypes = {
    handleUserProps: HandleUserPropsType;
};

export default function ChangeUsernameForm({
    ownProps: { handleUserProps },
}: OwnPropsType) {
    const router = useRouter();
    const { user, setUser } = handleUserProps;
    const [showMessage, onShowMessage] = useState<boolean>(false);
    const { uniqueValidation, manyValidation } = useValidate();
    const [isButtonClickable, setClickableButton] = useState(true);
    const [inputState, setInputState] = useState({
        newUsername: {
            isControlledFromOutside: false,
            showInputMessage: false,
            highlightInput: false,
            onShowInputMessage: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    newUsername: {
                        ...prev.newUsername,
                        showInputMessage: value,
                    },
                })),
            onHighlightInput: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    newUsername: { ...prev.newUsername, highlightInput: value },
                })),
            setControlledFromOutside: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    newUsername: {
                        ...prev.newUsername,
                        isControlledFromOutside: value,
                    },
                })),
        },
    });
    const [inputs, setInputs] = useState({
        newUsername: {
            validations: (currentInputValue: string) => [
                {
                    coditional: !currentInputValue.match(/.{6,}/),
                },
            ],
            required: true,
            value: '',
            errors: [],
        },
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
                                input: uniqueValidation(inputs.newUsername),
                                inputState: inputState.newUsername,
                            }}
                        />
                    </div>
                    {renderError()}
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

    function renderError() {
        if (!showMessage) return <div className="form-error-message"></div>;
        return <div className="form-error-message">{DEFAULT_MESSAGE}</div>;
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (showMessage) return; // WAITING THE MESSAGE GOES DOWN TO REQUEST
        if (manyValidation(inputs)) {
            if (!isButtonClickable) return;
            await onSubmitInputs();
            setClickableButton(false);
            return;
        }
        inputState.newUsername.onHighlightInput(true);
        inputState.newUsername.onShowInputMessage(true);
        inputState.newUsername.setControlledFromOutside(true);
        onShowMessage(true);
        setClickableButton(true);
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
        if (!parsedResponse.serverResponse) {
            return parsedResponse.body as string;
        }
        inputState.newUsername.onShowInputMessage(true);
        onShowMessage(false);
        router.reload();
        window.addEventListener('load', () => {
            setUser({ username: parsedResponse.body as string });
        });
    }
}
