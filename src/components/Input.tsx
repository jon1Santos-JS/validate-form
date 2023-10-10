import React, { useEffect, useState } from 'react';

type InputPropsTypes<T extends string> = {
    ownProps: PropsType;
    inputStateProps: inputStatePropsType<T>;
};

type inputStatePropsType<T extends string> = {
    input: ValidateInputType<T>;
    inputState: InputState;
};

type PropsType = {
    label?: string;
    inputType: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputAccept?: string;
};

export default function Input<T extends string>({
    ownProps,
    inputStateProps,
}: InputPropsTypes<T>) {
    const { label, inputType, onChange, inputAccept } = ownProps;
    const { input, inputState } = inputStateProps;
    const { value, errors } = input;
    const [errorMessage, setErrorMessage] = useState<null | string>(null);
    const {
        showInputMessage,
        highlightInput,
        isControlledFromOutside,
        justHighlight,
        onShowInputMessage,
        onHighlightInput,
        setControlledFromOutside,
    } = inputState;
    const highlightConditional =
        errorMessage || errorMessage === '' || justHighlight;

    useEffect(() => {
        if (isControlledFromOutside) {
            setErrorMessage(errors[0]);
            setControlledFromOutside(false);
            return;
        }
    }, [errors, isControlledFromOutside, setControlledFromOutside]);

    useEffect(() => {
        if (!value) return;
        const timeout = setTimeout(() => {
            setErrorMessage(errors[0]);
        }, 950);
        return () => clearTimeout(timeout);
    }, [errors, value, isControlledFromOutside]);

    useEffect(() => {
        if (!value) return;
        if (errorMessage) {
            onShowInputMessage(true);
            onHighlightInput(true);
            return;
        }
        onHighlightInput(false);
        onShowInputMessage(false);
    }, [errorMessage, onHighlightInput, onShowInputMessage, value]);

    return (
        <div className="field">
            {label ? (
                <label htmlFor={label} className="label">
                    {label}
                </label>
            ) : null}
            <input
                id={label}
                className={`input ${
                    highlightConditional && highlightInput && 'has-error'
                }`}
                placeholder={label}
                accept={inputAccept && inputAccept}
                onChange={onChange}
                value={value}
                type={inputType}
            />
            {renderErrors()}
        </div>
    );

    function renderErrors() {
        return (
            <div className="input-error-message">
                {errorMessage && showInputMessage && errorMessage}
            </div>
        );
    }
}
