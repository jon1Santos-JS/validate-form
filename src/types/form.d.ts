declare type HandledInputsType<T extends string, U> = {
    [key in T]: U;
};

declare type InputsToValidateType = {
    [key: string]: ValidateInputType;
};

declare interface ValidateInputType<T extends string> {
    validations?: (
        currentInput: string,
        inputs?: HandledInputsType<T, ValidateInputType<T>>,
    ) => Validation[];
    required?: boolean | string;
    errors: string[];
    value: string;
    files?: FileList | null;
}

declare interface Validation {
    coditional: boolean | RegExpMatchArray | null;
    message?: string;
}

declare type Prettier<T> = {
    [K in keyof T]: T[K];
};
