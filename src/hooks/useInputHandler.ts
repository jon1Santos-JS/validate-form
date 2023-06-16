import _ from 'lodash';

export function onOmitFormInputFields<T extends object>(
    inputs: T,
    ...fieldsToOmit: string[][]
) {
    const handled = _.omit(inputs, fieldsToOmit[0]);
    const handledFieldsToOmit = fieldsToOmit;
    while (handledFieldsToOmit[0 + 1]) {
        handledFieldsToOmit.shift();
        for (const i in handled) {
            handled[i] = onOmitFormInputFields(
                handled[i] as T,
                ...handledFieldsToOmit,
            );
        }
    }
    return handled as T[Extract<keyof T, string>];
}

export function onAddFormInputsFields(inputs: PreFormInputsType) {
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
