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
    const [showMessage, setShowMessage] = useState<boolean>(false);
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
        setShowMessage(false);
    }, [errorList, input]);

    useEffect(() => {
        const currentTimer = onShowMessage(false, 2550);
        return () => clearTimeout(currentTimer);
    }, [showMessage, formContext]);

    useEffect(() => {
        if (!showMessage) setShowMessage(formContext.showInputErrorsByForm);
    }, [formContext.showInputErrorsByForm, showMessage]);

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
        if (!errorList || !showMessage) return;

        return errorList.map((err) => (
            <div className="has-text-danger" key={err}>
                {err}
            </div>
        ));
    }

    function onShowMessage(value: boolean, time: number) {
        const currentTimer = setTimeout(() => {
            setShowMessage(value);
        }, time);
        return currentTimer;
    }
};

export default Input;
