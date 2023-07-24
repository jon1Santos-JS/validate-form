// FORM INPUTS PRE-DEFINED TYPES

declare interface PreFormInputsType {
    [key: string]: PreFormInputPropsType;
}

declare interface PreFormInputPropsType {
    validations?: (
        currentInput: string,
        formInputs: FormInputsType,
    ) => Validation[];
    required?: boolean | string;
    errors?: string[];
    value?: string;
}

declare interface Validation {
    coditional: boolean | RegExpMatchArray | null;
    message?: string;
}

// FORM INPUT ATTRIBUTES TO COSTUMIZE

declare type ComplementaryTargetPropsType = 'files';

declare type InputsTargetPropsType<T extends ComplementaryTargetPropsType> = [
    'value',
    ...T[],
];

// *FORM NECESSARY INPUT'S FIELDS TO VALIDATE

declare interface FormInputsType {
    [key: string]: FormInputPropsType;
}

declare interface FormInputPropsType extends PreFormInputPropsType {
    errors: string[];
    value?: string;
}

// FORM INPUT'S FIELDS TO SUBMIT

declare interface FormInputsTypeToSubmit {
    [key: string]: FormInputPropsTypeToSubmit;
}

declare interface FormInputPropsTypeToSubmit {
    files?: FileType;
    value: string;
}

declare type HandledInputs<T> = Partial<
    Record<keyof T, FormInputPropsTypeToSubmit>
>;

declare type FileType = FileList | undefined | null;
