import { useState } from 'react';
import Input from './Input';
import { useRouter } from 'next/router';
import useValidate from '@/hooks/useValidate';
import useInputHandler from '@/hooks/useInputHandler';
const API = 'api/changeUsername';

const DEFAULT_MESSAGE = 'Invalid username';

type OwnPropsType = {
    ownProps: ChangeUsernameFormPropsTypes;
};

type ChangeUsernameFormPropsTypes = {
    handleUserProps: HandleUserPropsType;
};

type InputsType = 'newUsername';

export default function ChangeUsernameForm({
    ownProps: { handleUserProps },
}: OwnPropsType) {
    const router = useRouter();
    const { user, setUser } = handleUserProps;
    const [showMessage, onShowMessage] = useState<boolean>(false);
    const { uniqueValidation, manyValidation } = useValidate();
    const { onHighlightManyInputs } = useInputHandler();
    const [isButtonClickable, setClickableButton] = useState(true);
    const [inputState, setInputState] = useState({
        newUsername: {
            showInputMessage: false,
            highlightInput: false,
            onShowInputMessage: onShowInputMessage,
            onHighlightInput: onHighlightInput,
        },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        newUsername: {
            validations: (currentInputValue: string) => [
                {
                    coditional: !currentInputValue.match(/.{6,}/),
                    message: '',
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
                                input: inputs.newUsername,
                                inputState: inputState.newUsername,
                            }}
                            formProps={{
                                hasError: false,
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
        setInputs((prev) => ({
            ...prev,
            [name]: uniqueValidation({ ...prev[name] }),
        }));
    }

    function onShowInputMessage(value: boolean, key: InputsType) {
        setInputState((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                showInputMessage: value,
            },
        }));
    }

    function onHighlightInput(value: boolean, key: InputsType) {
        setInputState((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                highlightInput: value,
            },
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
        onHighlightManyInputs(inputState, true, 2);
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
        inputState.newUsername.onShowInputMessage(true, 'newUsername');
        onShowMessage(false);
        router.reload();
        window.addEventListener('load', function () {
            setUser({ username: parsedResponse.body as string });
            window.removeEventListener('load', () => this);
        });
    }
}
