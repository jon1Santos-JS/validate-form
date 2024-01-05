import React, { useId } from 'react';

type InputPropsTypes<T extends string> = {
    ownProps: PropsType;
    inputStateProps: inputStatePropsType<T>;
};

type inputStatePropsType<T extends string> = {
    input: ValidateInputType<T, T>;
    inputState: InputState<T>;
};

type PropsType = {
    label?: string;
    inputType: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
    inputAccept?: string;
};

export default function Input<T extends string>({
    ownProps,
    inputStateProps,
}: InputPropsTypes<T>) {
    const { label, inputType, onChange, onClick, inputAccept } = ownProps;
    const { input, inputState } = inputStateProps;
    const { attributes, errors, requestErrors } = input;
    const { showInputMessage, highlightInput } = inputState;
    const inputID = useId();
    const hilightConditional =
        errors.length > 0 || (requestErrors && requestErrors.length > 0);

    return (
        <div className="field">
            {label ? (
                <label htmlFor={label} className="label">
                    {label}
                </label>
            ) : null}
            <input
                id={inputID + label}
                className={`input ${
                    hilightConditional && highlightInput && 'has-error'
                }`}
                placeholder={label}
                accept={inputAccept && inputAccept}
                onChange={onChange}
                onClick={onClick}
                value={attributes.value}
                type={inputType}
            />
            {renderErrors()}
        </div>
    );

    function renderErrors() {
        return (
            <div className="input-error-message">
                {errors.length > 0 && showInputMessage && errors[0]}
                {requestErrors &&
                    requestErrors.length > 0 &&
                    showInputMessage &&
                    requestErrors[0]}
            </div>
        );
    }
}
