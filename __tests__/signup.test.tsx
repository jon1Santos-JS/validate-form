import DBAccountHandler from '@/database/accountHandler';
// import { MONGO_HANDLER } from './mongoAccess.test';

const AMOUNT_OF_ACCOUNTS = 9;

// beforeAll(async () => {
//     await MONGO_HANDLER.connect('test');
//     await MONGO_HANDLER.accessState('test');
// });

test('sign up', async () => {
    await testLoop(AMOUNT_OF_ACCOUNTS);
});

export async function testLoop(limit: number) {
    const DBAccountHandler = new DBAccountHandler();
    const account = {
        username: { value: randomString() },
        password: { value: randomString() },
    };
    await expect(DBAccountHandler.signUp(account)).resolve.toBe(undefined);
    limit--;
    if (limit === 0) return;
    testLoop(limit);
}

function randomCharacter(min: number, max: number) {
    const code = Math.floor(Math.random() * (max - min) + min);
    return String.fromCharCode(code);
}

function randomString() {
    const stringArray = [];
    for (let i = 1; i <= 6; i++) {
        stringArray.push(randomCharacter(97, 123));
    }

    return stringArray.join('');
}
