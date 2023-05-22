'use client';

import FormContext from '@/context/FormContext';
import React, { useState, useEffect, useContext } from 'react';

interface InputProps {
    label: string;
    inputType: string;
    validation?: (inputValue: string) => string[] | undefined;
}

const Input: React.FC<InputProps> = ({ label, inputType, validation }) => {
    const formContext = useContext(FormContext);
    const [inputvalue, setInputValue] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState<
        boolean | undefined
    >(false);
    const [errorList, setErrorList] = useState<string[] | null | undefined>(
        null,
    );

    useEffect(() => {
        setErrorList(validation && validation(inputvalue));
    }, [inputvalue, setErrorList, validation]);

    useEffect(() => {
        // UP MESSAGE
        if (errorList && errorList?.length >= 1) {
            const currentTimer = setTimer(true, 650);
            return () => clearTimeout(currentTimer);
        }
        setShowErrorMessage(false);
    }, [errorList, inputvalue]);

    useEffect(() => {
        // DOWN MESSAGE
        const currentTimer = setTimer(false, 2550);
        return () => clearTimeout(currentTimer);
    }, [showErrorMessage, formContext]);

    useEffect(() => {
        if (!showErrorMessage)
            setShowErrorMessage(formContext.showInputErrorsMessagesByForm);
    }, [formContext.showInputErrorsMessagesByForm, showErrorMessage]);

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
        if (!errorList || !showErrorMessage) return;

        return errorList.map((err) => (
            <div className="has-text-danger" key={err}>
                {err}
            </div>
        ));
    }

    function setTimer(value: boolean, time: number) {
        const currentTimer = setTimeout(() => {
            setShowErrorMessage(value);
        }, time);
        return currentTimer;
    }
};

export default Input;
