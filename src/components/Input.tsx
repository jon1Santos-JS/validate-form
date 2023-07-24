import InputHandlerContext from '@/context/InputHandlerContext';
import useValidate from '@/hooks/useValidate';
import React, { useState, useEffect, useContext } from 'react';

interface InputProps {
    label: string;
    inputType: string;
    objectifiedName: string;
    inputName?: string;
    inputAccept?: string;
    targetProps: InputsTargetPropsType<ComplementaryTargetPropsType>;
}

const Input: React.FC<InputProps> = ({
    label,
    inputType,
    objectifiedName,
    inputName,
    inputAccept,
    targetProps,
}) => {
    const { inputs, showInputMessagesFromOutside, onChangeInput } =
        useContext(InputHandlerContext);
    const { preValidate } = useValidate();
    const [showMessage, setShowMessage] = useState(false);
    const [errorList, setErrorList] = useState<string[]>([]);

    useEffect(() => {
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
                onChange={onGetValues}
                type={inputType}
            />
            {renderErrors()}
        </div>
    );

    function onGetValues(e: React.ChangeEvent<HTMLInputElement>) {
        targetProps.map((props) => {
            const handledAttribute = {
                objectifiedName: objectifiedName,
                targetProps: props,
                value: e.target[props],
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
