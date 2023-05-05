import { DataBase, MiniDB } from './miniDB';

export class MiniDBAccountHandler {
    #DB = new MiniDB();

    async signIn(userAccount: InputDataBaseType) {
        if (!(await this.#onInitDB())) return 'internal server error';
        const account = this.#authAccount(userAccount);
        if (!account) {
            console.log('account was not found');
            return 'account was not found';
        }
        return JSON.stringify(account, undefined, 2);
    }

    async signUp(userAccount: InputDataBaseType) {
        if (!(await this.#onInitDB())) return 'internal server error';
        if (this.#authAccount(userAccount)) {
            console.log('account already exist');
            return 'account already exist';
        }
        return this.#createAccount(userAccount);
    }

    async #onInitDB() {
        try {
            await this.#DB.init();
            return true;
        } catch {
            return false;
        }
    }

    #authAccount(userAccount: InputDataBaseType) {
        const account = DataBase.accounts.find((value) => {
            if (
                value.password.value === userAccount.password.value &&
                value.username.value === userAccount.username.value
            )
                return value;
            return undefined;
        });
        if (!account) return false;
        return account;
    }

    async #createAccount(userAccount: InputDataBaseType) {
        DataBase.accounts.push(createTimeStamp(userAccount));
        await this.#DB.handleDB(
            'refresh',
            'MiniDBAccountsHandler - createAccount',
        );
        return 'account has been created';
    }
}

function createTimeStamp(userAccount: InputDataBaseType) {
    const todaysDate = new Date();
    const todaysDateFormated = todaysDate
        .toLocaleString()
        .split(', ')
        .join('-');
    const accountWithTimeStamp = {
        ...userAccount,
        timeStamp: todaysDateFormated,
    };

    return accountWithTimeStamp;
}
