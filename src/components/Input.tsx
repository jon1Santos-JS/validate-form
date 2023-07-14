import InputHandlerContext from '@/context/InputHandlerContext';
import useValidate from '@/hooks/useValidate';
import React, { useState, useEffect, useContext } from 'react';

interface InputProps {
    label: string;
    inputType: string;
    fieldName: string;
    inputName?: string;
    inputAccept?: string;
    attributes?: InputsAttributesFields[];
}

const Input: React.FC<InputProps> = ({
    label,
    inputType,
    fieldName,
    inputName,
    inputAccept,
    attributes,
}) => {
    const {
        inputs,
        showInputMessagesFromOutside,
        onChangeInputValue,
        onChangeInput,
    } = useContext(InputHandlerContext);
    const { preValidate } = useValidate();
    const [showMessage, setShowMessage] = useState(false);
    const [errorList, setErrorList] = useState<string[]>([]);
    const [currentInputValue, setCurrentInputValue] = useState(
        inputs[fieldName].value,
    );

    useEffect(() => {
        setErrorList(preValidate(fieldName, inputs));
    }, [fieldName, inputs, preValidate]);

    useEffect(() => {
        if (!currentInputValue) return; // DONT SHOW THE MESSAGE ON FIRST RENDER
        setShowMessage(false); // RESET THE MESSAGE AS THE ERROR LIST POP AN ERROR OFF
        if (errorList?.length >= 1) {
            const currentTimer = setMessageWithTimer(true, 850);
            return () => clearTimeout(currentTimer);
        }
    }, [errorList, fieldName, currentInputValue]);

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
                value={inputs[fieldName].value}
                type={inputType}
            />
            {renderErrors()}
        </div>
    );

    function onGetValues(e: React.ChangeEvent<HTMLInputElement>) {
        const handledRequiredAttributes = {
            fieldName: fieldName,
            value: e.target.value,
        };
        setCurrentInputValue(e.target.value);
        onChangeInputValue(handledRequiredAttributes);

        // if (!attributes) return;
        // console.log('passed');
        // attributes.map((attribute) => {
        //     const handledValue = e.target[attribute] ? e.target[attribute] : '';
        //     const handledNullValue = handledValue === null ? '' : handledValue;
        //     const handledAttribute = {
        //         fieldName: fieldName,
        //         attribute: attribute,
        //         value: handledNullValue,
        //     };
        //     onChangeInput(handledAttribute);
        // });
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
