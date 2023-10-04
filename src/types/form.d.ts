declare type HandledInputsType<T extends string> = {
    [key in T]: Partial<ValidateInputType<T>>;
};

declare type InputsToValidateType<T extends string> = {
    [key in T]: ValidateInputType<T>;
};

declare interface ValidateInputType<T extends string> {
    validations?: (
        currentInputValue: string,
        conditionalInputValue?: InputsToValidateType<T>,
    ) => Validation[];
    required?: boolean | string;
    errors: string[];
    value: string;
    cleanErrors?: boolean;
}

declare interface Validation {
    coditional: boolean | RegExpMatchArray | null;
    message?: string;
}
