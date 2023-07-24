import multer from 'multer';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Request, Response } from 'express';
import { mkdirSync, rmSync } from 'fs';

export type NextApiRequestWithFormData = NextApiRequest &
    Request & {
        files: unknown[];
    };

export type NextApiResponseCustom = NextApiResponse & Response;

class ImageHandler {
    #URL = path.resolve('./public/uploads/');

    refreshDirectory() {
        this.#deleteDirectory();
        this.#createDirectory();
    }

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

    #storage = multer.diskStorage({
        destination: this.#URL,
        filename: (req, file, callback) => {
            callback(null, file.originalname);
        },
    });

    #config = {
        storage: this.#storage,
        fileFilter: this.#fileFilter,
    };

    #deleteDirectory = async () => {
        try {
            await rmSync(this.#URL, { force: true, recursive: true });
            console.log('directory has been deleted');
        } catch (e) {
            console.log('failed to delete directory: ', e);
        }
    };

    #createDirectory = async () => {
        try {
            await mkdirSync(this.#URL);
            console.log('directory has been created');
        } catch (e) {
            console.log('failed to create directory: ', e);
        }
    };
}

export const imageHandler = new ImageHandler();
