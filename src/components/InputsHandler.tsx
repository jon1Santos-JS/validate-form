import InputHandlerContext from '@/context/InputHandlerContext';
import { useState } from 'react';
import _ from 'lodash';

interface InputHandlerPropsTypes {
    preInputs: PreFormInputsType;
    children: JSX.Element[] | JSX.Element;
}

export default function InputsHandler({
    preInputs,
    children,
}: InputHandlerPropsTypes) {
    const [inputs, setInputs] = useState(onAddFormInputsFields(preInputs));
    const [showInputMessagesByOutside, setShowInputMessages] = useState(false);

    return (
        <InputHandlerContext.Provider
            value={{
                showInputMessagesByOutside,
                inputs,
                updateInputValue,
                updateInputsToSubmit,
                setShowInputsMessage,
            }}
        >
            {children}
        </InputHandlerContext.Provider>
    );

    function updateInputValue(value: string, fieldName: string) {
        setInputs({
            ...inputs,
            [fieldName]: {
                validations: inputs[fieldName].validations,
                value: value,
                errors: inputs[fieldName].errors,
                required: inputs[fieldName].required,
            },
        });
    }
    function updateInputsToSubmit() {
        return onOmitFormInputsFields(inputs);
    }
    function setShowInputsMessage(value: boolean) {
        setShowInputMessages(value);
    }
}

function onOmitFormInputsFields(preInputs: PreFormInputsType) {
    const mainFieldsToOmit = Object.keys(preInputs).filter((key) =>
        key.includes('confirm'),
    );
    const secondaryFieldsToOmit = ['required', 'validations', 'errors'];
    const handledInputs: unknown = onOmitFields(
        preInputs,
        mainFieldsToOmit,
        secondaryFieldsToOmit,
    );
    return handledInputs as FormInputsTypeToSubmit;
}

function onAddFormInputsFields(inputs: PreFormInputsType) {
    const inputsWithError = addErrorInput(inputs);
    const inputsWithValue = addValueInput(inputsWithError);

    function addErrorInput(handledInputs: PreFormInputsType) {
        for (const i in handledInputs) {
            handledInputs[i].errors = [];
        }
        return handledInputs;
    }

    function addValueInput(handledInputs: PreFormInputsType) {
        for (const i in handledInputs) {
            handledInputs[i].value = '';
        }
        return handledInputs;
    }

    return inputsWithValue as FormInputsType;
}

function onOmitFields<T extends object>(
    inputs: T,
    ...fieldsToOmit: string[][]
) {
    const handled = _.omit(inputs, fieldsToOmit[0]);
    const handledFieldsToOmit = fieldsToOmit;
    while (handledFieldsToOmit[0 + 1]) {
        handledFieldsToOmit.shift();
        for (const i in handled) {
            handled[i] = onOmitFields(handled[i] as T, ...handledFieldsToOmit);
        }
    }
    return handled as T[Extract<keyof T, string>];
}
