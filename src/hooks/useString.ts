import { onConverToBasicLatinLetters } from '@/lib/lodashAdapter';

export default function useString() {
    function handledName(name: string) {
        const handledName = onConverToBasicLatinLetters(name);
        const noCedilha = handledName.replace(/[çÇ]/g, (match) =>
            match === 'ç' ? 'c' : 'C',
        );

        return noCedilha;
    }

    function onCheckExtensions(extensions: string[], text: string) {
        const validate = { value: false };
        extensions.forEach((extension) =>
            text.includes(extension) ? (validate.value = true) : null,
        );
        return validate.value;
    }

    return { handledName, onCheckExtensions };
}
