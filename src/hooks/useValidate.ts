export default function useValidate() {
    function manyValidation<T extends string>(inputs: InputsToValidateType<T>) {
        let isValid = true;
        for (const i in inputs) {
            if (inputs[i].required && !inputs[i].value)
                setRequiredMessage(inputs[i].errors, inputs[i].required);
            if (inputs[i].errors.length > 0) isValid = false;
        }
        return isValid;
    }

    function uniqueValidation<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
    ) {
        return validate(input, inputs);
    }

    function validate<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
        isCrossField?: boolean,
    ) {
        const { value, validations, required } = input;
        const newErrors: string[] = [];

        if (isCrossField && !value) return input;
        if (required && !value) {
            setRequiredMessage(input.errors, required);
            return input;
        }
        if (!validations) return input;
        const crossfield = validations(value, inputs && inputs).reduce(
            (_, { coditional, message, crossfield }) => {
                if (coditional) {
                    newErrors.push(message);
                }
                return crossfield;
            },
            '' as T | undefined,
        );
        input.errors = [...newErrors];
        if (inputs && crossfield && !isCrossField)
            validate(inputs[crossfield], inputs, true);
        return input;
    }

    function setRequiredMessage(errors: string[], required?: string | boolean) {
        const conditional = typeof required === 'string' ? required : '';
        errors.push(conditional);
        return errors;
    }

    return { uniqueValidation, manyValidation };
}
