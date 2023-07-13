import multer from 'multer';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Request, Response } from 'express';

export type NextApiRequestWithFormData = NextApiRequest &
    Request & {
        files: unknown[];
    };

export type NextApiResponseCustom = NextApiResponse & Response;

class uploadImage {
    #URL = path.resolve('./public/uploads/');

    uploadImage(req: NextApiRequestWithFormData, res: NextApiResponseCustom) {
        const upload = multer(this.#config).single('image');
        upload(req, res, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Upload failed' });
            }
        });
    }

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

    #storage = multer.diskStorage({
        destination: this.#URL,
        filename: (req, file, callback) => {
            const handledName = this.#handledName(file.originalname);
            callback(null, handledName);
        },
    });

    #config = {
        storage: this.#storage,
        fileFilter: this.#fileFilter,
    };
}

export const imageHandler = new uploadImage();
