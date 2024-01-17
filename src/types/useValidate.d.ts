declare type InputsToValidateType<T extends string> = {
    [key in T]: ValidateInputType<T, T>;
};

declare interface ValidateInputType<T extends string, U extends T> {
    validations?: AsyncValidateFunctionType<T>;
    validationsSync?: ValidateFunctionType<T>;
    errors: string[];
    requestErrors?: string[];
    crossfields?: U[];
    attributes: InputAttributes;
    required?: { value: boolean; message?: string };
}

declare interface InputAttributes {
    value: string;
    files?: FileList | null;
}

declare type ValidateFunctionType<T extends string> = (
    inputAttributes: InputAttributes,
    currentInputs?: InputsToValidateType<T>,
) => Validation[];

declare type AsyncValidateFunctionType<T extends string> = (
    inputAttributes: InputAttributes,
    currentInputs?: InputsToValidateType<T>,
) => Promise<Validation[]>;

declare interface Validation {
    conditional: boolean | RegExpMatchArray | null | Promise<boolean | string>;
    message: string;
}
