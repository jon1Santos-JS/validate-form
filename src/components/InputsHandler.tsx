import { useState } from 'react';
import InputsHandledContext from '@/context/InputsHandlerContext';
import { Lodash } from '@/lib/lodashAdapter';

interface InputHandlerPropsTypes<T extends string> {
    preInputs: PreFormInputsType<T>;
    children: JSX.Element[] | JSX.Element;
}

const INPUTS_FIELDS_TO_OMIT_FROM_SERVER = ['required', 'validations', 'errors'];

export default function InputsHandler<T extends string>({
    preInputs,
    children,
}: InputHandlerPropsTypes<T>) {
    const [inputs, setInputs] = useState(onAddFormInputsFields(preInputs));
    const [handledInputs, setHandledInputs] = useState(
        onOmitFormInputsFields(preInputs),
    );
    const [showInputMessagesFromOutside, setShowInputMessages] =
        useState(false);

    return (
        <InputsHandledContext.Provider
            value={{
                showInputMessagesFromOutside,
                inputs,
                handledInputs,
                onChangeInput,
                updateInputsToSubmit,
                setShowInputsMessage,
            }}
        >
            {children}
        </InputsHandledContext.Provider>
    );

    function onChangeInput<T, U>({
        objectifiedName,
        targetProp,
        value,
    }: onChangeInputsProps<T, U>) {
        setInputs((prevInputs) => {
            // UPDATING THE OBJECT WITH THE NEW ESPECIFIC INPUT
            const updatedInput = {
                ...prevInputs[objectifiedName],
                [targetProp]: value,
            };
            // RETURNED ALL INPUTS WITH THE SPECIFIC INPUT UPTATED
            return {
                ...prevInputs,
                [objectifiedName]: updatedInput,
            };
        });
        setHandledInputs((prevInputs) => {
            const updatedInput = {
                ...prevInputs[objectifiedName],
                [targetProp]: value,
            };
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

function onAddFormInputsFields<T extends PreFormInputsType<string>>(
    preInputs: T,
) {
    const handledInputs = onAddRequiredInputs();

    function onAddRequiredInputs() {
        for (const i in preInputs) {
            preInputs[i].errors = [];
            preInputs[i].value = '';
        }
        return preInputs;
    }

    return handledInputs as FormInputsType<keyof typeof preInputs>;
}

function onOmitFormInputsFields<T extends string>(
    preInputs: PreFormInputsType<T>,
) {
    const mainFieldsToOmit = Object.keys(preInputs).filter((key) =>
        key.includes('confirm'),
    );
    const secondaryFieldsToOmit = INPUTS_FIELDS_TO_OMIT_FROM_SERVER;
    const handledInputs = Lodash.onOmitFields(
        preInputs,
        mainFieldsToOmit,
        secondaryFieldsToOmit,
    ) as FormInputsTypeToSubmit<string>;

    return handledInputs as FormHandledInputsType<keyof typeof preInputs>;
}
