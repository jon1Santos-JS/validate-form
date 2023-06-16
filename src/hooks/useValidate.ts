export default function useValidate(preObjectfiedInputs: PreFormInputsType) {
    const objectfiedInputs = onAddFormInputsFields(preObjectfiedInputs);

    const validateUsername = (currentInputValue = '', fieldName: string) => {
        return preValidate(
            objectfiedInputs[fieldName], // OBJECTIFIED INPUT
            currentInputValue, // INPUT CURRENT VALUE STATE
            objectfiedInputs,
        );
    };

    const validatePassword = (currentInputValue = '', fieldName: string) => {
        return preValidate(
            objectfiedInputs[fieldName],
            currentInputValue,
            objectfiedInputs,
        );
    };

    const validateConfirmPassword = (
        currentInputValue = '',
        fieldName: string,
    ) => {
        return preValidate(
            objectfiedInputs[fieldName],
            currentInputValue,
            objectfiedInputs,
        );
    };

    const validateEmail = (currentInputValue = '', fieldName: string) => {
        return preValidate(
            objectfiedInputs[fieldName],
            currentInputValue,
            objectfiedInputs,
        );
    };

    const validateConfirmEmail = (
        currentInputValue = '',
        fieldName: string,
    ) => {
        return preValidate(
            objectfiedInputs[fieldName],
            currentInputValue,
            objectfiedInputs,
        );
    };

    const inputsValidationFunctions = {
        validateUsername,
        validatePassword,
        validateConfirmPassword,
        validateEmail,
        validateConfirmEmail,
    };

    const validateAllInputs = () => {
        const inputsNames = Object.keys(objectfiedInputs);
        const inputErrors = inputsNames.map((inputName) => {
            const validationFunction = getInputValidationFunction(
                inputsValidationFunctions,
                inputName,
            );
            if (!validationFunction) return;
            return validationFunction(
                objectfiedInputs[inputName].value,
                inputName,
            );
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

    return { ...inputsValidationFunctions, validateAllInputs };
}

function preValidate(
    objectifiedInput: FormInputPropsType,
    currentInputValue: string,
    formInputs: FormInputsType,
) {
    setAndResetInput(objectifiedInput, currentInputValue);
    return validate(objectifiedInput, currentInputValue, formInputs);
}

function setAndResetInput(
    objectfiedInput: FormInputPropsType,
    currentInputValue: string,
) {
    while (objectfiedInput.errors.length > 0) {
        objectfiedInput.errors.pop();
    }
    objectfiedInput.value = currentInputValue;
}

function validate(
    objectfiedInput: FormInputPropsType,
    currentInputValue: string,
    formInputs: FormInputsType,
) {
    if (!objectfiedInput.validations) return [];
    if (!currentInputValue && objectfiedInput.required) {
        if (typeof objectfiedInput.required === 'string') {
            objectfiedInput.errors.push(objectfiedInput.required);
            return objectfiedInput.errors;
        }
        objectfiedInput.errors.push('This field is required');
        return objectfiedInput.errors;
    }
    if (!currentInputValue) return [];

    objectfiedInput
        .validations(currentInputValue, formInputs)
        .map((validation) => {
            if (validation.coditional)
                objectfiedInput.errors.push(validation.message);
        });
    if (objectfiedInput.errors.length < 1) return [];
    return objectfiedInput.errors;
}

/*
AUXILIARY FUNCTIONS
*/

function getInputValidationFunction(
    validationFunctions: ReturnValidationFunctionsType,
    inputName: string,
) {
    const handledFunctions = Object.values(validationFunctions);
    const validationFunctionFound = handledFunctions.find((validationFunc) => {
        const handledFunctionName = validationFunc.name
            .toLowerCase()
            .replace('validate', '');
        const handledInputName = inputName.toLowerCase();
        if (handledFunctionName === handledInputName) {
            return validationFunc;
        }
        return;
    });
    return validationFunctionFound;
}

export function onAddFormInputsFields(inputs: PreFormInputsType) {
    const handledInputs = addErrorInput();

    function addErrorInput() {
        for (const i in inputs) {
            inputs[i].errors = [];
        }
        return inputs;
    }

    return handledInputs as FormInputsType;
}
