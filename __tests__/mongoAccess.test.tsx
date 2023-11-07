import { MONGO_HANDLER } from '@/database/DBhandler';

test('mongo connection', async () => {
    expect(await MONGO_HANDLER.connect('test')).toStrictEqual({
        success: true,
    });
});

test('mongo access', async () => {
    expect(await MONGO_HANDLER.accessState('test')).toStrictEqual({
        success: true,
    });
});
