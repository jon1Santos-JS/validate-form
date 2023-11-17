export default function useInputHandler() {
    async function onCheckUsername(url: string, options: FetchOptionsType) {
        const response = await fetch(url, options);
        const parsedResponse: DBDefaultResponse = await response.json();
        return parsedResponse.success;
    }

    function inputsFactory<T extends string, G extends T>({
        asyncValidations,
        validations,
        required,
        crossfields,
        attributes,
    }: ValidateInputType<T, G>) {
        return {
            asyncValidations,
            validations,
            attributes,
            errors: [],
            required,
            crossfields,
        };
    }

    return {
        inputsFactory,
        onCheckUsername,
    };
}
