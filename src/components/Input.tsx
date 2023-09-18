import useValidate from '@/hooks/useValidate';
import React, { useState, useEffect } from 'react';

interface InputPropsTypes<T extends string> {
    ownProps: PropsType;
    validateProps: ValidatePropsType<T>;
}

interface ValidatePropsType<T extends string> {
    input: ValidateInputType<T>;
    inputs: HandledInputsType<T, ValidateInputType<T>>;
    showInputMessagesFromOutside: boolean;
}

interface PropsType {
    label: string;
    inputType: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputName?: string;
    inputAccept?: string;
}

export default function Input<T extends string>({
    ownProps,
    validateProps,
}: InputPropsTypes<T>) {
    const { label, inputType, onChange, inputName, inputAccept } = ownProps;
    const { input, showInputMessagesFromOutside, inputs } = validateProps;
    const { value } = input;

    const { preValidate } = useValidate(inputs);
    const [showMessage, setShowMessage] = useState(false);
    const [errorList, setErrorList] = useState<string[]>([]);

    useEffect(() => {
        setErrorList(preValidate(input));
    }, [preValidate, input]);

    useEffect(() => {
        if (!value) return; // DONT SHOW THE MESSAGE ON FIRST RENDER
        setShowMessage(false); // RESET THE MESSAGE AS THE ERROR LIST POP AN ERROR OFF
        if (errorList?.length >= 1) {
            const currentTimer = setMessageWithTimer(true, 850);
            return () => clearTimeout(currentTimer);
        }
    }, [errorList, value]);

    useEffect(() => {
        if (!showMessage) setShowMessage(showInputMessagesFromOutside);
    }, [showInputMessagesFromOutside, showMessage]);

    useEffect(() => {
        const currentTimer = setMessageWithTimer(false, 3000);
        return () => clearTimeout(currentTimer);
    }, [showMessage]);

    return (
        <div className="field">
            <label htmlFor={label} className="label">
                {label}
            </label>
            <input
                id={label}
                className="input"
                name={inputName && inputName}
                accept={inputAccept && inputAccept}
                onChange={onChange}
                value={value}
                type={inputType}
            />
            {renderErrors()}
        </div>
    );

    function renderErrors() {
        if (!showMessage) return null;

        return errorList.map((err) => (
            <div className="has-text-danger" key={err}>
                {err}
            </div>
        ));
    }

    function setMessageWithTimer(value: boolean, time: number) {
        const currentTimer = setTimeout(() => {
            setShowMessage(value);
        }, time);
        return currentTimer;
    }
}
