const API = 'api/checkUsername';

export default function useInputHandler() {
    async function onCheckUsername(username: string) {
        const options = { method: 'POST', body: username };
        const response = await fetch(API, options);
        const parsedResponse: ServerResponse = await response.json();
        return parsedResponse.serverResponse;
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
