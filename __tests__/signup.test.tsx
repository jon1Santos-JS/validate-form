/**
 * @jest-environment node
 */

import UserRegisterHandler from '@/database/AccountHandler/Register';
import { MongoDB } from '@/database/DBHandler/DBMongo';
import { DATABASE } from '@/database/DBHandler/DBState';
import '@testing-library/jest-dom';
const AMOUNT_OF_ACCOUNTS = 9;

beforeAll(async () => {
    const db = new MongoDB();
    await db.accessState('signup test');
});

afterAll(async () => {
    const db = new MongoDB();
    await db.refreshState('signup test');
});

test('max sign up test', async () => {
    await testLoop(AMOUNT_OF_ACCOUNTS);
}, 20000);

export async function testLoop(limit: number) {
    const register = new UserRegisterHandler();
    const account = {
        username: { value: randomString() },
        password: { value: randomString() },
    };
    if (DATABASE.state.accounts.length === 10) return;
    await expect(register.signUp(account)).resolves.toStrictEqual({
        success: true,
        data: 'Account has been created',
    });
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
