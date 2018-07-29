/*
 * MIT License
 *
 * Copyright (c) 2018 Prasen Palvankar1
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Created Date: Saturday, July 28th 2018, 04:21:41 pm
 *
 * Author: Prasen Palvankar
 *
 * -----
 * Last Modified: Sat Jul 28 2018
 * Modified By: Prasen Palvankar
 * -----
 */


import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


export enum StorageTypes {
    Settings = "settings"
};

export interface Settings {
    controllerUrl: string;
}

@Injectable()
export class StorageServiceProvider {

    constructor(private storage: Storage) {

    }

    public async getData(key: StorageTypes) {
        let resp: any;
        try {
            let data = await this.storage.get(key);
            if (data) {
                resp = JSON.parse(data);
            }
        } catch (err) {
            console.error(`Failed to get data for ${key}`, err);
            throw err;
        }
        return resp;
    }

    public async putData(key: StorageTypes, value: Settings) {
        try {
            this.storage.set(key, JSON.stringify(value))
        } catch (err) {
            console.error(`Failed to store data for key ${key}`, err);
            throw err;
        }
    }

    public async removeData(key: string) {
        try {
            this.storage.remove(key)
        } catch (err) {
            console.warn(`Failed to delete data for key = ${key}`, err);
        }

    }

}

