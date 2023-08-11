import { omit } from 'lodash';

class LodashAdapter {
    onOmitFields<T extends object>(inputs: T, ...fieldsToOmit: string[][]) {
        const handled = omit(inputs, fieldsToOmit[0]);
        const handledFieldsToOmit = fieldsToOmit;
        while (handledFieldsToOmit[0 + 1]) {
            handledFieldsToOmit.shift();
            for (const i in handled) {
                handled[i] = this.onOmitFields(
                    handled[i] as T,
                    ...handledFieldsToOmit,
                );
            }
        }
        return handled as T[Extract<keyof T, string>];
    }
}

export const Lodash = new LodashAdapter();
