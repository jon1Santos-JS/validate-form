import useValidate from '@/hooks/useValidate';
import React, { useState, useEffect } from 'react';

interface InputPropsTypes {
    props: PropsType;
    handleInputsProps: HandleInputsPropsType<string>;
}

interface PropsType {
    label: string;
    inputType: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    objectifiedName: string;
    inputName?: string;
    inputAccept?: string;
}

export default function Input({ props, handleInputsProps }: InputPropsTypes) {
    const {
        label,
        inputType,
        onChange,
        objectifiedName,
        inputName,
        inputAccept,
    } = props;
    const { inputs, showInputMessagesFromOutside } = handleInputsProps;

    const { preValidate } = useValidate();
    const [showMessage, setShowMessage] = useState(false);
    const [errorList, setErrorList] = useState<string[]>([]);

    useEffect(() => {
        // ALL INPUTS ARE NECESSARY TO COMAPRE CONFIRM FIELDS INTO THE VALIDATION HOOK
        setErrorList(preValidate(objectifiedName, inputs));
    }, [objectifiedName, inputs, preValidate]);

    useEffect(() => {
        if (!inputs[objectifiedName].value) return; // DONT SHOW THE MESSAGE ON FIRST RENDER
        setShowMessage(false); // RESET THE MESSAGE AS THE ERROR LIST POP AN ERROR OFF
        if (errorList?.length >= 1) {
            const currentTimer = setMessageWithTimer(true, 850);
            return () => clearTimeout(currentTimer);
        }
    }, [errorList, inputs, objectifiedName]);

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
