import FormContext from '@/context/FormContext';
import React, { useState, useEffect, useContext } from 'react';

interface InputProps {
    label: string;
    inputType: string;
    validation?: (inputValue: string) => string[] | undefined;
    crossValidation?: (data: string) => void;
}

const Input: React.FC<InputProps> = ({
    label,
    inputType,
    validation,
    crossValidation,
}) => {
    const formContext = useContext(FormContext);
    const [inputvalue, setInputValue] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [errorList, setErrorList] = useState<string[] | null | undefined>(
        null,
    );

    useEffect(() => {
        if (!crossValidation || !inputvalue) return;
        crossValidation(inputvalue);
    }, [crossValidation, inputvalue]);

    useEffect(() => {
        if (!validation) return;
        setErrorList(validation(inputvalue));
    }, [inputvalue, setErrorList, validation, errorList]);

    useEffect(() => {
        // DONT SHOW MESSAGE ON FIRST RENDER
        if (!inputvalue && !formContext.showMessagesByForm) return;
        // UP MESSAGE
        if (errorList && errorList?.length >= 1) {
            const currentTimer = setErrorMessageWithTimer(true, 850);
            return () => clearTimeout(currentTimer);
        }
        setShowMessage(false);
    }, [errorList, formContext.showMessagesByForm, inputvalue]);

    useEffect(() => {
        // DOWN MESSAGE
        const currentTimer = setErrorMessageWithTimer(false, 2750);
        return () => clearTimeout(currentTimer);
    }, [showMessage]);

    useEffect(() => {
        if (!showMessage) setShowMessage(formContext.showMessagesByForm);
    }, [formContext.showMessagesByForm, showMessage]);

    return (
        <div className="field">
            <label htmlFor={label} className="label">
                {label}
            </label>
            <input
                id={label}
                className="input"
                onChange={(e) => setInputValue(e.target.value)}
                value={inputvalue}
                type={inputType}
            />
            {renderErrors()}
        </div>
    );

    function renderErrors() {
        if (!errorList || !showMessage) return;

        return errorList.map((err) => (
            <div className="has-text-danger" key={err}>
                {err}
            </div>
        ));
    }

    function setErrorMessageWithTimer(value: boolean, time: number) {
        const currentTimer = setTimeout(() => {
            setShowMessage(value);
        }, time);
        return currentTimer;
    }
};

export default Input;
