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
    const [showInputsMessage, onShowInputsMessage] = useState(false);
    const [highlightInput, onHighlightInput] = useState(false);
    const [showMessage, onShowMessage] = useState<boolean>(false);
    const { uniqueValidation, manyValidation } = useValidate();
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
                            validateProps={{
                                input: uniqueValidation(inputs.newUsername),
                                showInputMessagesFromOutside: showInputsMessage,
                                highlightInput,
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
            await onSubmitInputs();
            return;
        }
        onHighlightInput(true);
        onShowMessage(true);
        onShowInputsMessage(true);
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
        onShowInputsMessage(false);
        onShowMessage(false);
        router.reload();
        window.addEventListener('load', () => {
            setUser({ username: parsedResponse.body as string });
        });
    }
}
