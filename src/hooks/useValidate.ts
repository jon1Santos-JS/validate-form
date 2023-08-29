const EMPTY_INPUT_ERROR_RESPONSE = 'This field is required';

export default function useValidate() {
    const validateAllInputs = <T extends string>(
        formInputs: FormInputsType<T>,
    ) => {
        const inputsKeys = Object.keys(formInputs);
        const inputErrors = inputsKeys.map((inputName) => {
            return preValidate(inputName as T, formInputs);
        });
        const validations = inputErrors.map((error) => {
            if (!error) return false;
            if (error.length >= 1) return true;
            return false;
        });
        const validation = validations.find(
            (validation) => validation === true,
        );
        const findConditional = validation === undefined ? false : validation;

        return findConditional;
    };

    const preValidate = <T extends string>(
        fieldName: T,
        formInputs: FormInputsType<T>,
    ) => {
        setAndResetInput(formInputs[fieldName]);
        return validate<typeof fieldName, typeof formInputs>(
            formInputs[fieldName],
            formInputs,
        );
    };

    function setAndResetInput<T extends string>(
        objectfiedInput: FormInputPropsType<T>,
    ) {
        while (objectfiedInput.errors.length > 0) {
            objectfiedInput.errors.pop();
        }
    }

    function validate<T extends string, U extends FormInputsType<T>>(
        objectfiedInput: FormInputPropsType<T>,
        formInputs: U,
    ) {
        if (!objectfiedInput.validations) return objectfiedInput.errors;
        if (!objectfiedInput.value && objectfiedInput.required) {
            if (typeof objectfiedInput.required === 'string') {
                objectfiedInput.errors.push(objectfiedInput.required);
                return objectfiedInput.errors;
            }
            objectfiedInput.errors.push(EMPTY_INPUT_ERROR_RESPONSE);
            return objectfiedInput.errors;
        }
        if (!objectfiedInput.value) return objectfiedInput.errors;

        objectfiedInput
            .validations<U>(objectfiedInput.value, formInputs)
            .map((validation) => {
                const message = validation.message ? validation.message : '';
                if (validation.coditional) objectfiedInput.errors.push(message);
            });
        return objectfiedInput.errors;
    }

    return { preValidate, validateAllInputs };
}
