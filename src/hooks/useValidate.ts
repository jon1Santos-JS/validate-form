export default function useValidate() {
    function manyValidation<T extends string>(inputs: InputsToValidateType<T>) {
        let isValid = true;
        for (const i in inputs) {
            if (inputs[i].errors.length > 0) isValid = false;
        }
        return isValid;
    }

    function uniqueValidation<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
    ) {
        const { cleanErrors } = input;
        if (typeof cleanErrors === 'undefined' || cleanErrors === true)
            input.errors = [];
        delete input.cleanErrors;
        return validate(input, inputs);
    }

    function validate<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
    ) {
        const { value, validations } = input;

        if (!validations) return input;

        const newErrors: string[] = [];
        validations(value, inputs && inputs).map((validation) => {
            if (validation.coditional) newErrors.push(validation.message);
        });
        input.errors = [...newErrors];
        return input;
    }

    return { uniqueValidation, manyValidation };
}
