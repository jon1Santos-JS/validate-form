import multer from 'multer';
import path from 'path';

class uploadImage {
    #URL = path.resolve('./public/uploads/');

    #storage = multer.diskStorage({
        destination: this.#URL,
        filename: (req, file, callback) => {
            const handledName = this.#handledName(file.originalname);
            callback(null, handledName);
        },
    });

    #fileFilter = (
        req: unknown,
        file: Express.Multer.File,
        callback: multer.FileFilterCallback,
    ) => {
        const conditions = ['jpg', 'jpeg', 'png'];
        const extension = file.originalname.split('.').pop();
        if (!extension) return callback(null, false);
        conditions.map((condition) => {
            if (extension.includes(condition)) callback(null, true);
            callback(null, false);
        });
    };

    #handledName(name: string) {
        const noCedilha = name.replace(/[çÇ]/g, (match) =>
            match === 'ç' ? 'c' : 'C',
        );

        return noCedilha;
    }

    getConfig = {
        storage: this.#storage,
        fileFilter: this.#fileFilter,
    };
}

export const imageHandler = new uploadImage();
