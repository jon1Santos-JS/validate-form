import { readFileSync, writeFileSync } from 'fs';
import { DATABASE, DEFAULT_ERROR, INITIAL_STATE } from './DBState';

const MINI_DB_FILE_PATH_NAME = 'miniDBFile.json';

export class JsonDB {
    async accessState(caller: string) {
        try {
            const data = await readFileSync(MINI_DB_FILE_PATH_NAME, 'utf8');
            DATABASE.state = JSON.parse(data);
            console.log('Json Database has been accessed by:', caller);
            return { success: true } as DBResponse;
        } catch {
            DATABASE.state = INITIAL_STATE;
            return await this.createState(caller);
        }
    }
    async refreshState(caller: string) {
        const json = JSON.stringify(DATABASE.state, undefined, 2);
        try {
            await writeFileSync(MINI_DB_FILE_PATH_NAME, json);
            console.log('Json DB has been refreshed by:', caller);
            return { success: true } as DBResponse;
        } catch {
            console.log('failed to refresh Json DB by:', caller);
            return {
                success: false,
                data: DEFAULT_ERROR,
            } as DBResponse;
        }
    }

    async createState(caller: string) {
        const json = JSON.stringify(DATABASE.state, undefined, 2);
        try {
            await writeFileSync(MINI_DB_FILE_PATH_NAME, json);
            console.log('Json DB has been created by:', caller);
            return { success: true } as DBResponse;
        } catch {
            console.log('failed to create Json DB by:', caller);
            return {
                success: false,
                data: DEFAULT_ERROR,
            } as DBResponse;
        }
    }
}
