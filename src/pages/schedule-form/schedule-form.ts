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
 * Created Date: Friday, July 27th 2018, 06:41:35 pm
 *
 * Author: Prasen Palvankar
 *
 * -----
 * Last Modified: Sat Jul 28 2018
 * Modified By: Prasen Palvankar
 * -----
 */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Schedule, StatusResponse, AppServicesProvider, GetScheduleResponse, Station, StationsResponse } from './../../providers/services/app-services';

@IonicPage()
@Component({
    selector: 'page-schedule-form',
    templateUrl: 'schedule-form.html',
})
export class ScheduleFormPage {
    public daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    public hours = ['Every Hour', 'Midnight',
        "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM",
        "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];

    public addScheduleForm: FormGroup;
    public schedule: Schedule;
    public stations: Station[];
    public scheduleName: string;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private formBuilder: FormBuilder,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private appServices: AppServicesProvider) {

        this.scheduleName = navParams.get('name');

        this.schedule = this.newSchedule();
        this.createForm();

        this.appServices.getStations()
            .subscribe(
                (resp: StationsResponse) => {
                    this.stations = resp.data;
                },
                err => {
                    this.showAlert('Error!', `Failed to retrieve stations ${err}`);
                }
            );
        if (this.scheduleName) {
            this.appServices.getSchedule(this.scheduleName)
                .subscribe(
                    (resp: GetScheduleResponse) => {
                        this.schedule = resp.data;
                        this.createForm();

                    },
                    err => {
                        this.showAlert('Error!', `Failed to retrieve schedule "${name}"`);
                    }
                );

        }


    }

    private createForm() {
        this.addScheduleForm = this.formBuilder.group({
            name: [this.schedule.name, Validators.required],
            description: [this.schedule.description, Validators.required],
            deviceId: [this.schedule.deviceId, Validators.required],
            action: [this.schedule.action, Validators.required],
            active: [this.schedule.active, Validators.required],
            recurs: [this.schedule.rule.recurs, Validators.required],
            dayOfWeek: [this.dayOfWeek, Validators.required],
            year: [this.schedule.rule.year, Validators.nullValidator],
            month: [this.schedule.rule.month, Validators.nullValidator],
            date: [this.schedule.rule.date, Validators.nullValidator],
            hour: [this.hour, Validators.required],
            minute: [this.schedule.rule.minute, Validators.required],
            second: [this.schedule.rule.second, Validators.nullValidator],
            duration: [this.schedule.duration, Validators.nullValidator]
        });
    }

    private newSchedule(): Schedule {
        return {
            name: "",
            description: "",
            deviceId: null,
            action: "off",
            active: false,
            duration: 1,
            rule: {
                recurs: true,
                year: null,
                month: null,
                date: null,
                dayOfWeek: null,
                hour: null,
                minute: 0,
                second: 0
            }

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

    private get hour(): number {
        return (this.schedule.rule.hour ? this.schedule.rule.hour + 1 : 0);
    }

    private set hour(h: number) {
        this.schedule.rule.hour = (h === 0 ? null : h - 1);
    }

    private get dayOfWeek(): number[] {
        if (this.schedule.rule.dayOfWeek && this.schedule.rule.dayOfWeek.length > 0) {
            return this.schedule.rule.dayOfWeek;
        } else {
            return [0, 1, 2, 3, 4, 5, 6];
        }
    }

    private set dayOfWeek(days: number[]) {
        this.schedule.rule.dayOfWeek = days;
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


    public get editNew(): string {
        return this.scheduleName ? "Edit" : "Add";
    }

    public submit() {

        let ctrl = this.addScheduleForm.controls;
        this.schedule.action = ctrl.action.value;
        this.schedule.active = ctrl.active.value;
        this.schedule.description = ctrl.description.value;
        this.schedule.deviceId = ctrl.deviceId.value;
        this.schedule.duration = (ctrl.action.value === 'off' ? 0 : ctrl.duration.value);
        this.schedule.name = ctrl.name.value;
        this.schedule.rule.date = ctrl.date.value;
        this.schedule.rule.dayOfWeek = ctrl.dayOfWeek.value;
        this.schedule.rule.hour = ctrl.hour.value === 0 ? null : ctrl.hour.value - 1;
        this.schedule.rule.minute = ctrl.minute.value;
        this.schedule.rule.month = ctrl.month.value;
        this.schedule.rule.recurs = ctrl.recurs.value;
        this.schedule.rule.second = ctrl.second.value;
        this.schedule.rule.year = ctrl.year.value;

        //console.log(this.schedule);
        this.appServices.updateSchedule(this.schedule)
        .subscribe(
            (resp: StatusResponse) => {
                this.showToast(`Schedule "${this.schedule.name}" saved.`);
                this.navCtrl.pop();
            },
            err => {
                this.showAlert('Error!', `Failed to save schedule "${this.schedule.name}"`);
            }
        );

    }


}
