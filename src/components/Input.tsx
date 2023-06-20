import InputHandlerContext from '@/context/InputHandlerContext';
import useValidate from '@/hooks/useValidate';
import React, { useState, useEffect, useContext } from 'react';

interface InputProps {
    label: string;
    inputType: string;
    fieldName: string;
}

const Input: React.FC<InputProps> = ({ label, inputType, fieldName }) => {
    const { inputs, showInputMessages, updateInputValue } =
        useContext(InputHandlerContext);
    const { preValidate } = useValidate();
    const [showMessage, setShowMessage] = useState(false);
    const [errorList, setErrorList] = useState<string[]>([]);

    useEffect(() => {
        setShowMessage(false); // RESET THE MESSAGE AS THE ERRORS LIST POP AN ERROR OFF
        setErrorList(preValidate(fieldName, inputs));
    }, [fieldName, inputs, preValidate]);

    useEffect(() => {
        if (!inputs[fieldName].value) return; // DONT SHOW THE MESSAGE ON FIRST RENDER
        if (errorList?.length >= 1) {
            const currentTimer = setMessageWithTimer(true, 850);
            return () => clearTimeout(currentTimer);
        }
    }, [errorList, fieldName, inputs]);

    useEffect(() => {
        if (!showMessage) setShowMessage(showInputMessages);
    }, [showInputMessages, showMessage]);

    useEffect(() => {
        const currentTimer = setMessageWithTimer(false, 2750);
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
                onChange={(e) => updateInputValue(e.target.value, fieldName)}
                value={inputs[fieldName].value}
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
};

export default Input;
