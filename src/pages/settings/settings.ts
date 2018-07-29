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
 * Created Date: Saturday, July 28th 2018, 04:02:20 pm
 *
 * Author: Prasen Palvankar
 *
 * -----
 * Last Modified: Sat Jul 28 2018
 * Modified By: Prasen Palvankar
 * -----
 */


import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ToastController, NavParams, Events } from 'ionic-angular';
import { StorageServiceProvider, StorageTypes, Settings } from './../../providers/storage-service/storage-service';

@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})
export class SettingsPage {
    public settings: Settings;
    constructor(public navCtrl: NavController, public navParams: NavParams,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private events: Events,
        private storageService: StorageServiceProvider) {

        this.settings = {
            controllerUrl: ""
        };
        this.init();
    }

    private async init() {
        let settings = await this.storageService.getData(StorageTypes.Settings);
        if (settings) {
            this.settings = settings;
        }
    }

    private showAlert(title: string, mesg: string) {
        let alert = this.alertCtrl.create({
            title: title,
            message: mesg,
            buttons: ['OK']
        });
        alert.present();
    }

    private showToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'events-toast',
            position: 'middle',
            duration: 2000
        });
        toast.present();
    }

    public async save() {
        try {
            await this.storageService.putData(StorageTypes.Settings, this.settings);
            this.showToast('Settings saved successfully!');
            this.events.publish('settings:updated');

        } catch (err) {
            this.showAlert('Error!', `Failed to save settings ${err}`);
        }
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad SettingsPage');
    }

}
