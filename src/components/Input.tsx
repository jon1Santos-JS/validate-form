import React, { MutableRefObject, useId } from 'react';

type InputPropsTypes<T extends string> = {
    ownProps: PropsType;
    inputStateProps: inputStatePropsType<T>;
};

type inputStatePropsType<T extends string> = {
    input: ValidateInputType<T, T>;
    inputState?: InputState;
};

type InputState = {
    showInputMessage?: boolean;
    highlightInput?: boolean;
};

type PropsType = {
    label?: string;
    inputType: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
    inputAccept?: string;
    className?: string;
    ref?: MutableRefObject<null>;
};

export default function Input<T extends string>({
    ownProps,
    inputStateProps,
}: InputPropsTypes<T>) {
    const { label, inputType, className, onChange, onClick, inputAccept, ref } =
        ownProps;
    const { input, inputState } = inputStateProps;
    const { attributes, errors, requestErrors } = input;
    const inputID = useId();
    const hilightConditional =
        errors.length > 0 || (requestErrors && requestErrors.length > 0);

    return (
        <div className="field">
            {label ? (
                <label htmlFor={label} className="label l-text--primary">
                    {label}
                </label>
            ) : null}
            <input
                id={inputID + label}
                className={`input l-text--primary ${className} ${
                    hilightConditional &&
                    inputState?.highlightInput &&
                    'has-error'
                }`}
                placeholder={label}
                accept={inputAccept && inputAccept}
                onChange={onChange}
                onClick={onClick}
                value={attributes.value}
                type={inputType}
                ref={ref}
            />
            {renderErrors()}
        </div>
    );

    function renderErrors() {
        const errorsConditional =
            errors.length > 0 && inputState?.showInputMessage && errors[0];
        const requestErrorsConditional =
            requestErrors &&
            requestErrors.length > 0 &&
            inputState?.showInputMessage &&
            requestErrors[0];

        return (
            <div className="l-text--danger input-error-message">
                {errorsConditional || requestErrorsConditional}
            </div>
        );
    }
}
