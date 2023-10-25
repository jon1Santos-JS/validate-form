export default function useValidate() {
    function validateMany<T extends string>(inputs: InputsToValidateType<T>) {
        let isValid = true;
        for (const i in inputs) {
            if (inputs[i].required && !inputs[i].value)
                onCheckRequired(inputs[i]);
            if (inputs[i].errors.length > 0) isValid = false;
        }
        return isValid;
    }

    function validateSingle<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
    ) {
        validate(input, inputs);
        if (!input.crossfield || !inputs) return input;
        crossfieldValidate(inputs[input.crossfield], inputs);
        return input;
    }

    function validate<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
    ) {
        const { value, validations, required } = input;
        const newErrors: string[] = [];

        if (required && !value) {
            onCheckRequired(input);
            return input;
        }
        if (!validations) return input;
        validations(value, inputs && inputs).forEach(
            ({ coditional, message }) => {
                if (coditional) {
                    newErrors.push(message);
                }
            },
        );
        input.errors = [...newErrors];
        return input;
    }

    function crossfieldValidate<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
    ) {
        const { value, validations, required } = input;
        const newErrors: string[] = [];

        if (!value) return input;

        if (required && !value) {
            onCheckRequired(input);
            return input;
        }
        if (!validations) return input;
        validations(value, inputs && inputs).forEach(
            ({ coditional, message }) => {
                if (coditional) {
                    newErrors.push(message);
                }
            },
        );
        input.errors = [...newErrors];
        return input;
    }

    function onCheckRequired<T extends string>(input: ValidateInputType<T>) {
        const conditional =
            typeof input.required === 'string' ? input.required : '';
        input.errors.push(conditional);
    }

    return { validateSingle, validateMany };
}
