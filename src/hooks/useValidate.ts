import { useMemo } from 'react';

export default function useValidate() {
    const validateAllInputs = (formInputs: FormInputsType) => {
        const inputsNames = Object.keys(formInputs);
        const inputErrors = inputsNames.map((inputName) => {
            return preValidate(inputName, formInputs);
        });
        const validations = inputErrors.map((error) => {
            if (!error) return false;
            if (error.length >= 1) return true;
            return false;
        });
        const validation = validations.find(
            (validation) => validation === true,
        );
        const conditional = validation === undefined ? false : validation;

        return conditional;
    };

    // DO NOT RECREATE A FUNCTION FOR EACH INPUT
    const preValidate = useMemo(() => {
        return (fieldName: string, formInputs: FormInputsType) => {
            setAndResetInput(formInputs[fieldName]);
            return validate(formInputs[fieldName], formInputs);
        };
    }, []);

    function setAndResetInput(objectfiedInput: FormInputPropsType) {
        while (objectfiedInput.errors.length > 0) {
            objectfiedInput.errors.pop();
        }
    }

    function validate(
        currentInput: FormInputPropsType,
        formInputs: FormInputsType,
    ) {
        if (!currentInput.validations) return [];
        if (!currentInput.value && currentInput.required) {
            if (typeof currentInput.required === 'string') {
                currentInput.errors.push(currentInput.required);
                return currentInput.errors;
            }

            currentInput.errors.push('This field is required');
            return currentInput.errors;
        }
        if (!currentInput.value) return [];

        currentInput
            .validations(currentInput.value, formInputs)
            .map((validation) => {
                if (validation.coditional)
                    currentInput.errors.push(validation.message);
            });
        if (currentInput.errors.length < 1) return [];
        return currentInput.errors;
    }

    return { preValidate, validateAllInputs };
}
