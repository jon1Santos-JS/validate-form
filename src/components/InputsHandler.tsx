import { useState } from 'react';
import _ from 'lodash';
import InputHandlerContext from '@/context/InputHandlerContext';

interface InputHandlerPropsTypes {
    preInputs: PreFormInputsType;
    children: JSX.Element[] | JSX.Element;
}

export default function InputsHandler({
    preInputs,
    children,
}: InputHandlerPropsTypes) {
    const [inputs, setInputs] = useState(onAddFormInputsFields(preInputs));
    const [showInputMessagesFromOutside, setShowInputMessages] =
        useState(false);

    return (
        <InputHandlerContext.Provider
            value={{
                showInputMessagesFromOutside,
                inputs,
                onChangeInput,
                updateInputsToSubmit,
                setShowInputsMessage,
            }}
        >
            {children}
        </InputHandlerContext.Provider>
    );

    function onChangeInput({
        objectifiedName,
        attribute,
        value,
    }: onChangeInputsProps) {
        setInputs((prevInputs) => {
            // GETTING THE OBJECT  WITH THE NEWPROP ADDED INTO THE SPECIFIC FIELD (objectifiedName)
            const updatedInput = {
                ...prevInputs[objectifiedName],
                [attribute]: value,
            };
            // RETURNED ALL INPUTS WITH THE SPECIFIC FIELD UPTATED
            return {
                ...prevInputs,
                [objectifiedName]: updatedInput,
            };
        });
    }

    function updateInputsToSubmit() {
        return onOmitFormInputsFields(inputs);
    }

    function setShowInputsMessage(value: boolean) {
        setShowInputMessages(value);
    }
}

// AUXILIARY FUNCTIONS

function onAddFormInputsFields(inputs: PreFormInputsType) {
    const handledInputs = onAddRequiredInputs();

    function onAddRequiredInputs() {
        for (const i in inputs) {
            inputs[i].errors = [];
            inputs[i].value = '';
        }
        return inputs;
    }

    return handledInputs as FormInputsType;
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
