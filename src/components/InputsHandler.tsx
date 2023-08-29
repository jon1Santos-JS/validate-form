import { useEffect, useState } from 'react';
import { Lodash } from '@/lib/lodashAdapter';
import React from 'react';

interface InputHandlerPropsTypes<T extends string> {
    preInputs: PreFormInputsType<T>;
    renderChildren: (
        handleInputsProps: HandleInputsPropsType<T>,
    ) => JSX.Element[] | JSX.Element;
}

const INPUTS_FIELDS_TO_OMIT_FROM_SERVER = ['required', 'validations', 'errors'];

export default function InputsHandler<T extends string>({
    preInputs,
    renderChildren,
}: InputHandlerPropsTypes<T>) {
    const [inputs, setInputs] = useState(onAddFormInputsFields(preInputs));
    const [handledInputs, setHandledInputs] = useState(
        onOmitFormInputsFields(preInputs),
    );
    const [showInputMessagesFromOutside, setShowInputMessages] =
        useState(false);
    const handleInputsProps: HandleInputsPropsType<T> = {
        showInputMessagesFromOutside,
        inputs,
        handledInputs,
        onChangeInput,
        setShowInputsMessage,
    };

    useEffect(() => {
        setHandledInputs(onOmitFormInputsFields(inputs));
    }, [inputs]);

    return <>{renderChildren(handleInputsProps)}</>;

    function onChangeInput<R extends T, U>({
        objectifiedName,
        targetProp,
        value,
    }: {
        objectifiedName: R;
        targetProp: TargetPropsType;
        value: U;
    }) {
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
    }

    function setShowInputsMessage(value: boolean) {
        setShowInputMessages(value);
    }
}

// AUXILIARY FUNCTIONS

function onAddFormInputsFields<T extends string>(
    preInputs: PreFormInputsType<T>,
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
): FormHandledInputsType<keyof typeof preInputs> {
    const mainFieldsToOmit = Object.keys(
        preInputs as PreFormInputsType<T>,
    ).filter((key) => key.includes('confirm'));
    const secondaryFieldsToOmit = INPUTS_FIELDS_TO_OMIT_FROM_SERVER;
    const handledInputs = Lodash.onOmitFields(
        preInputs as PreFormInputsType<T>,
        mainFieldsToOmit,
        secondaryFieldsToOmit,
    );

    return handledInputs as FormHandledInputsType<keyof typeof preInputs>;
}
