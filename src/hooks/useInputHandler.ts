import _ from 'lodash';

export default function useInputHandler() {
    function onOmitInputs<T extends object, R>(inputs: T, fields: string[]) {
        const handledInputs = _.omit(inputs, [...fields]);
        return handledInputs as R;
    }

    async function onSubmitInputs<T>(
        inputs: T,
        requestFunction: <T>(formContent: T) => Promise<void>,
    ) {
        const response = await requestFunction<T>(inputs);
        return response;
    }

    return { onOmitInputs, onSubmitInputs };
}
