import useFirstRender from '@/hooks/useFirstRender';
import React, { useState, useEffect } from 'react';

type InputPropsTypes<T extends string> = {
    ownProps: PropsType;
    validateProps: ValidatePropsType<T>;
};

type ValidatePropsType<T extends string> = {
    input: ValidateInputType<T>;
    showInputMessagesFromOutside: boolean;
    highlightInput: boolean;
};

type PropsType = {
    label?: string;
    inputType: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputAccept?: string;
};

export default function Input<T extends string>({
    ownProps,
    validateProps,
}: InputPropsTypes<T>) {
    const [showMessage, onShowMessage] = useState(false);
    const isFirstRender = useFirstRender();
    const { label, inputType, onChange, inputAccept } = ownProps;
    const { input, showInputMessagesFromOutside, highlightInput } =
        validateProps;
    const { value, errors } = input;

    // IF THERE ARE STILL ERRORS IN THE INPUT THE HIGHLIGHT CONTINUES
    // (isFirstRender) USED INSTEAD OF (value) TO HIGHLIGHT THE INPUT EVEN EMPTY
    const insideHighlightCondition =
        !isFirstRender && value && showMessage ? 'has-error' : '';
    const outsideHighlightCondition = highlightInput ? 'has-error' : '';
    const generalHighlightCondition =
        errors.length >= 1 &&
        (insideHighlightCondition || outsideHighlightCondition);

    useEffect(() => {
        if (isFirstRender) return;
        if (!value) return;
        if (errors.length >= 1) {
            const currentTimer = setTimeout(() => {
                onShowMessage(true);
            }, 950);
            return () => {
                onShowMessage(false);
                clearTimeout(currentTimer);
            };
        }
    }, [errors, isFirstRender, value]);

    useEffect(() => {
        if (!showMessage && errors.length >= 1) {
            onShowMessage(showInputMessagesFromOutside);
        }
    }, [errors.length, showInputMessagesFromOutside, showMessage]);

    return (
        <div className="field">
            {label ? (
                <label htmlFor={label} className="label">
                    {label}
                </label>
            ) : null}
            <input
                id={label}
                className={`input ${generalHighlightCondition}`}
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
        // (errorList[0] === '') IS TO PREVENT TO SUBMIT WHILE THE INPUT IS REQUIRED
        if (!showMessage || errors[0] === '')
            return <div className="input-error-message"></div>;

        return <div className="input-error-message">{errors[0]}</div>;
    }
}
