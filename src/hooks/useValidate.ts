const EMPTY_INPUT_ERROR_RESPONSE = 'This field is required';

export default function useValidate() {
    function validateAll<T extends string>(inputs: HandledInputsType<T>) {
        const isValid = { value: true };
        for (const i in inputs) {
            if (inputs[i].errors) isValid.value = false;
        }
        return isValid.value;
    }

    function preValidate(content: ValidateInputType) {
        const { value, required, errors } = content;
        if (!value && required) {
            if (typeof required === 'string') {
                errors.push(required);
                return errors;
            }
            errors.push(EMPTY_INPUT_ERROR_RESPONSE);
            return errors;
        }
        return validate(content);
    }

    function validate({ value, validations, errors }: ValidateInputType) {
        if (!validations) return errors;
        if (!value) return errors;

        validations(value).map((validation) => {
            const message = validation.message ? validation.message : '';
            if (validation.coditional) errors.push(message);
        });
        return errors;
    }

    return { preValidate, validateAll };
}
