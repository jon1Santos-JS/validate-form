import _ from 'lodash';

export default function useInputHandler() {
    function onOmitFormInputFields<T extends object>(
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

    return { onOmitFormInputFields };
}
