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
    const handledInputs = addErrorInput();

    function addErrorInput() {
        for (const i in inputs) {
            inputs[i].errors = [];
        }
        return inputs;
    }

    return handledInputs as FormInputsType;
}
