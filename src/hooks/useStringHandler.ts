import _ from 'lodash';

export default function useStringHandler() {
    function handledName(name: string) {
        const handledName = _.deburr(name);
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
