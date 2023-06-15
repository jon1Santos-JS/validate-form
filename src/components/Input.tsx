import FormContext from '@/context/FormContext';
import React, { useState, useEffect, useContext } from 'react';

interface InputProps {
    label: string;
    inputType: string;
    validation?: (inputValue: string) => string[];
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
    const [errorList, setErrorList] = useState<string[]>([]);

    useEffect(() => {
        // RESET THE MESSAGE AS THE ERRORS LIST POP AN ERROR OFF
        setShowMessage(false);
        if (!validation) return;
        setErrorList(validation(inputvalue));
    }, [inputvalue, setErrorList, validation]);

    useEffect(() => {
        // DONT SHOW THE MESSAGE ON FIRST RENDER
        if (!inputvalue) return;
        // UP MESSAGE
        if (errorList && errorList?.length >= 1) {
            const currentTimer = setErrorMessageWithTimer(true, 850);
            return () => clearTimeout(currentTimer);
        }
    }, [errorList, inputvalue]);

    useEffect(() => {
        if (!showMessage) setShowMessage(formContext.showMessagesByForm);
    }, [formContext.showMessagesByForm, showMessage]);

    useEffect(() => {
        // DOWN MESSAGE
        const currentTimer = setErrorMessageWithTimer(false, 2750);
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
                onChange={(e) => onSetValues(e)}
                value={inputvalue}
                type={inputType}
            />
            {renderErrors()}
        </div>
    );

    function onSetValues(e: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(e.target.value);
        if (!crossValidation) return;
        crossValidation(e.target.value);
        if (validation) setErrorList(validation(e.target.value));
    }

    function renderErrors() {
        if (!showMessage) return null;
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
