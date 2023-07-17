// TYPES TO CUSTOMIZE

declare interface PreFormInputsType {
    [key: string]: PreFormInputPropsType;
}

declare interface PreFormInputPropsType extends InputsAttributesType {
    validations?: (
        currentInput: string,
        formInputs: FormInputsType,
    ) => Validation[];
    required?: boolean | string;
    errors?: string[];
}

declare interface InputsAttributesType {
    value?: string;
    files?: FileType;
}

declare type FileType = FileList | undefined | null;

declare interface Validation {
    coditional: boolean | RegExpMatchArray | null;
    message?: string;
}

declare type InputsAttributesFields = 'files' | 'value';

// *NECESSARY TYPES TO VALIDATE

declare interface FormInputsType {
    [key: string]: FormInputPropsType;
}

declare interface FormInputPropsType extends PreFormInputPropsType {
    errors: string[];
    value?: string;
}

// FORM TO SUBMIT

declare interface FormInputsTypeToSubmit {
    [key: string]: FormInputPropsTypeToSubmit;
}

declare interface FormInputPropsTypeToSubmit extends PreFormInputPropsType {
    value: string;
}
