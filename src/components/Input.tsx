import FormContext from '@/context/FormContext';
import React, { useState, useEffect, useContext } from 'react';

interface InputProps {
    label: string;
    inputType: string;
    validation?: (inputValue: string) => string[] | undefined;
}

const Input: React.FC<InputProps> = ({ label, inputType, validation }) => {
    const formContext = useContext(FormContext);
    const [input, setInput] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
    const [errorList, setErrorList] = useState<string[] | null | undefined>(
        null,
    );

    useEffect(() => {
        setErrorList(validation && validation(input));
    }, [input, setErrorList, validation]);

    useEffect(() => {
        if (errorList && errorList?.length >= 1) {
            const currentTimer = onShowMessage(true, 650);
            return () => clearTimeout(currentTimer);
        }
        setShowErrorMessage(false);
    }, [errorList, input]);

    useEffect(() => {
        const currentTimer = onShowMessage(false, 2550);
        return () => clearTimeout(currentTimer);
    }, [showErrorMessage, formContext]);

    useEffect(() => {
        if (!showErrorMessage)
            setShowErrorMessage(formContext.showInputErrorsMessagesByForm);
    }, [formContext.showInputErrorsMessagesByForm, showErrorMessage]);

    return (
        <div className="field">
            <label className="label">{label}: </label>
            <input
                className="input"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type={inputType}
            />
            {renderErrors()}
        </div>
    );

    function renderErrors() {
        if (!errorList || !showErrorMessage) return;

        return errorList.map((err) => (
            <div className="has-text-danger" key={err}>
                {err}
            </div>
        ));
    }

    function onShowMessage(value: boolean, time: number) {
        const currentTimer = setTimeout(() => {
            setShowErrorMessage(value);
        }, time);
        return currentTimer;
    }
};

export default Input;
