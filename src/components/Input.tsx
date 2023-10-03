import useFirstRender from '@/hooks/useFirstRender';
import React, { useState, useEffect } from 'react';

type InputPropsTypes<T extends string> = {
    ownProps: PropsType;
    validateProps: ValidatePropsType<T>;
};

type ValidatePropsType<T extends string> = {
    input: ValidateInputType<T>;
    // inputs: InputsToValidateType<T>;
    showInputMessagesFromOutside: boolean;
    highLightInputFromOutside: boolean;
};

type PropsType = {
    label: string;
    inputType: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputAccept?: string;
};

export default function Input<T extends string>({
    ownProps,
    validateProps,
}: InputPropsTypes<T>) {
    const isFirstRender = useFirstRender();
    const { label, inputType, onChange, inputAccept } = ownProps;
    const { input, showInputMessagesFromOutside, highLightInputFromOutside } =
        validateProps;
    const { value, errors } = input;

    const [showMessage, setShowMessage] = useState(false);
    const [showHighlight, setShowHighlight] = useState(false);

    // (isFirstRender) USED INSTEAD OF (value) TO HIGHLIGHT THE INPUT EVEN EMPTY
    const classHighlightErrorCondition =
        showHighlight && !isFirstRender && errors.length >= 1
            ? 'has-error'
            : '';

    useEffect(() => {
        if (!value) return;
        if (errors.length >= 1) {
            const currentTimer = setTimeout(() => {
                setShowMessage(true);
            }, 950);
            return () => clearTimeout(currentTimer);
        }
    }, [errors, value]);

    useEffect(() => {
        if (!value) return;
        if (errors.length >= 1) {
            const currentTimer = setTimeout(() => {
                setShowHighlight(true);
            }, 950);
            return () => clearTimeout(currentTimer);
        }
    }, [errors, value]);

    useEffect(() => {
        if (!showMessage && errors.length >= 1) {
            setShowMessage(showInputMessagesFromOutside);
        }
    }, [errors.length, showInputMessagesFromOutside, showMessage]);

    useEffect(() => {
        if (!showHighlight && errors.length >= 1) {
            setShowHighlight(highLightInputFromOutside);
        }
    }, [errors.length, highLightInputFromOutside, showHighlight]);

    console.log('renderizou');
    return (
        <>
            <label htmlFor={label} className="label">
                {label}
            </label>
            <input
                id={label}
                className={`input ${classHighlightErrorCondition}`}
                placeholder={label}
                accept={inputAccept && inputAccept}
                onChange={onChange}
                value={value}
                type={inputType}
            />
            {renderErrors()}
        </>
    );

    function renderErrors() {
        // (errorList[0] === '') IS TO PREVENT TO SUBMIT WHILE THE INPUT IS REQUIRED
        if (!showMessage || errors[0] === '')
            return <div className="input-error-message"></div>;

        return <div className="input-error-message">{errors[0]}</div>;
    }
}
