const EMPTY_INPUT_ERROR_RESPONSE = 'This field is required';

export default function useValidate() {
    const errors: string[] = [];

    // const validateAllInputs = <T extends string>(
    //     formInputs: FormInputsType<T>,
    // ) => {
    //     const inputsKeys = Object.keys(formInputs);
    //     const inputErrors = inputsKeys.map((inputName) => {
    //         return preValidate(inputName as T, formInputs);
    //     });
    //     const validations = inputErrors.map((error) => {
    //         if (!error) return false;
    //         if (error.length >= 1) return true;
    //         return false;
    //     });
    //     const validation = validations.find(
    //         (validation) => validation === true,
    //     );
    //     const findConditional = validation === undefined ? false : validation;

    //     return findConditional;
    // };

    function preValidate(content: ValidateType) {
        const { value, required } = content;
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

    function validate({ value, validations }: ValidateType) {
        if (!validations) return errors;
        if (!value) return errors;

        validations(value).map((validation) => {
            const message = validation.message ? validation.message : '';
            if (validation.coditional) errors.push(message);
        });
        return errors;
    }

    return { preValidate };
}
