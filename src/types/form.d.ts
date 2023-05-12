declare interface FormInputsType {
    [key: string]: FormInputPropsType;
}

declare interface FormInputTypeWithAuniqueProp {
    [key: string]: { value?: string };
}

declare interface FormInputPropsType {
    validations?: (
        currentInput: string,
        formInputs: FormInputsType,
    ) => Validation[];
    errors: string[];
    isEmpty: boolean;
    value?: string;
}

declare interface Validation {
    coditional: boolean | RegExpMatchArray | null;
    message: string;
}
