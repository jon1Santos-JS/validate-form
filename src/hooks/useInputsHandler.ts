import { onConverToBasicLatinLetters, onOmitProps } from '@/lib/lodashAdapter';

export default function useStringHandler() {
    function handledName(name: string) {
        const handledName = onConverToBasicLatinLetters(name);
        const noCedilha = handledName.replace(/[çÇ]/g, (match) =>
            match === 'ç' ? 'c' : 'C',
        );

        return noCedilha;
    }
    return { handledName };
}

export function onCheckExtensions(extensions: string[], text: string) {
    const validate = { value: false };
    extensions.forEach((extension) =>
        text.includes(extension) ? (validate.value = true) : null,
    );
    return validate.value;
}

export function omitFields<T extends string>(
    obj: HandledInputsType<T>,
    fieldsToOmit: (keyof ValidateInputType<T>)[],
) {
    const handleInputs = { ...obj };
    for (const i in handleInputs) {
        const typedIndex = i as T;
        handleInputs[typedIndex] = onOmitProps(
            handleInputs[typedIndex],
            fieldsToOmit,
        );
    }
    return handleInputs;
}
