declare type ValidationFunctionType = (
    currentInputValue?: string,
) => string[] | undefined;

declare interface ReturnValidationFunctionsType {
    [key: string]: ValidationFunctionType;
}
