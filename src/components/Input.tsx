import InputHandlerContext from '@/context/InputHandlerContext';
import useValidate from '@/hooks/useValidate';
import React, { useState, useEffect, useContext } from 'react';

interface InputProps {
    label: string;
    inputType: string;
    fieldName: string;
    attributes: InputsAttributesFields[];
    inputName?: string;
    inputAccept?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    inputType,
    fieldName,
    inputName,
    inputAccept,
    attributes,
}) => {
    const { inputs, showInputMessagesFromOutside, onChangeInput } =
        useContext(InputHandlerContext);
    const { preValidate } = useValidate();
    const [showMessage, setShowMessage] = useState(false);
    const [errorList, setErrorList] = useState<string[]>([]);

    useEffect(() => {
        setErrorList(preValidate(fieldName, inputs));
    }, [fieldName, inputs, preValidate]);

    useEffect(() => {
        if (!inputs[fieldName].value) return; // DONT SHOW THE MESSAGE ON FIRST RENDER
        setShowMessage(false); // RESET THE MESSAGE AS THE ERROR LIST POP AN ERROR OFF
        if (errorList?.length >= 1) {
            const currentTimer = setMessageWithTimer(true, 850);
            return () => clearTimeout(currentTimer);
        }
    }, [errorList, fieldName, inputs]);

    useEffect(() => {
        if (!showMessage) setShowMessage(showInputMessagesFromOutside);
    }, [showInputMessagesFromOutside, showMessage]);

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
                name={inputName && inputName}
                accept={inputAccept && inputAccept}
                onChange={onGetValues}
                type={inputType}
            />
            {renderErrors()}
        </div>
    );

    function onGetValues(e: React.ChangeEvent<HTMLInputElement>) {
        attributes.map((attribute) => {
            const handledAttribute = {
                fieldName: fieldName,
                attribute: attribute,
                value: e.target[attribute],
            };
            onChangeInput(handledAttribute);
        });
    }

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
