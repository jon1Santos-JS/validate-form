import _ from 'lodash';

export default function useInputHandler() {
    async function onSubmitInputs<T>(
        inputs: T,
        requestFunction: <T>(formContent: T) => Promise<void>,
    ) {
        const response = await requestFunction<T>(inputs);
        return response;
    }

    function onOmitFormInputFields<T extends object>(
        inputs: T,
        ...fieldsToOmit: string[][]
    ) {
        const handled = onOmitInputs(inputs, fieldsToOmit[0]);
        const handledFieldsToOmit = fieldsToOmit;
        while (fieldsToOmit[0 + 1]) {
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

    return { onSubmitInputs, onOmitFormInputFields };
}

function onOmitInputs<T extends object>(inputs: T, fields: string[]) {
    const handledInputs = _.omit(inputs, [...fields]);
    return handledInputs as T;
}
