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
 * Created Date: Friday, July 27th 2018, 06:20:23 pm
 *
 * Author: Prasen Palvankar
 *
 * -----
 * Last Modified: Sat Jul 28 2018
 * Modified By: Prasen Palvankar
 * -----
 */


import { AppServicesProvider, GetScheduleListResponse, Schedule, StatusResponse } from './../../providers/services/app-services';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';


@IonicPage()
@Component({
    selector: 'page-schedules',
    templateUrl: 'schedules.html',
})
export class SchedulesPage {
    schedules: Schedule[];

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private appServices: AppServicesProvider,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController) {
    }


    private loadSchedules() {
        this.appServices.getSchedules()
            .subscribe(
                (resp: GetScheduleListResponse) => {
                    this.schedules = resp.data;
                    console.log(resp.data)
                },
                err => console.error('Failed to load schedules', err)
            );
    }

    private showAlert(title: string, mesg: string) {
        let alert = this.alertCtrl.create({
            title: title,
            message: mesg,
            buttons: ['OK']
        });
        alert.present();
    }


    private showConfirmAlert(title: string, message: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let alert = this.alertCtrl.create({
                title: title,
                message: message,
                buttons: [
                    {
                        text: 'No',
                        role: 'cancel',
                        handler: () => {
                            resolve(false);
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            resolve(true);
                        }
                    }
                ]
            });
            alert.present();
        });

    }


    /**
     * Show message as a toast
     *
     * @private
     * @param {string} message
     * @memberof RecipesPage
     */
    private showToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'events-toast',
            position: 'bottom',
            duration: 2000
        });
        toast.present();
    }

    public refresh() {
        this.loadSchedules();
    }

    public editSchedule(schedule: Schedule) {
        console.log(`Edit schedule ${schedule.name}`);
        this.navCtrl.push('ScheduleFormPage', { name: schedule.name });
    }

    public addSchedule() {
        this.navCtrl.push('ScheduleFormPage');
    }

    public async deleteSchedule(schedule: Schedule) {
        let accept = await this.showConfirmAlert(`Delete Schedule ${schedule.name}`, 'Are you sure you want to delete the schedule?')
        if (accept) {
            this.appServices.deleteSchedule(schedule.name)
                .subscribe(
                    (resp: StatusResponse) => {
                        this.showToast(`Schedule "${schedule.name}" deleted.`);
                        this.refresh();
                    },
                    err => {
                        this.showAlert('ERROR', `Failed to delete schedule ${err}`);
                    }
                );


        }
    }

    ionViewDidEnter() {
        console.log('onViewDidEnter');
        this.loadSchedules();
    }
}
