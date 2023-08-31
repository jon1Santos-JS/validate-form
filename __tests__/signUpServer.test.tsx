import MiniDBAccountHandler from '@/database/accountHandler';

const AMOUNT_OF_ACCOUNTS = 9;

test('check signUp function', async () => {
    await testLoop(AMOUNT_OF_ACCOUNTS);
});

async function testLoop(limit: number) {
    const DBAccountHandler = new MiniDBAccountHandler();
    const account = {
        username: { value: randomString() },
        password: { value: randomString() },
    };
    await expect(DBAccountHandler.signUp(account)).resolves.toBe(undefined);
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
