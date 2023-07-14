// TYPES TO CUSTOMIZE

declare interface FetchOptionsType {
    method: MethodTypes;
    headers?: { [key: string]: string };
    body?: string;
}

declare type MethodTypes = 'GET' | 'DELETE' | 'POST';

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
    files?: FileList | string;
}

declare type AttributesType = null | FileList;

declare type InputsAttributesFields = 'files';

// *NECESSARY TYPES TO VALIDATE

declare interface FormInputsType {
    [key: string]: FormInputPropsType;
}

declare interface FormInputPropsType extends PreFormInputPropsType {
    errors: string[];
    value: string;
}

declare interface Validation {
    coditional: boolean | RegExpMatchArray | null;
    message?: string;
}

// FORM TO SUBMIT

declare interface FormInputsTypeToSubmit {
    [key: string]: FormInputPropsTypeToSubmit;
}

declare interface FormInputPropsTypeToSubmit extends PreFormInputPropsType {
    value: string;
}
