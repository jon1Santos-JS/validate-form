import _ from 'lodash';

export default function useObjecthandler() {
    function onOmitProp<t extends object, r>(
        inputs: t,
        prop: string | string[],
    ): r {
        const newInputs = _.omit(inputs, prop);
        return newInputs as r;
    }

    return { onOmitProp };
}
