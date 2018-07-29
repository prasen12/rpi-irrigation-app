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
 * Created Date: Monday, July 23rd 2018, 11:17:38 pm
 *
 * Author: Prasen Palvankar
 *
 * -----
 * Last Modified: Tue Jul 24 2018
 * Modified By: Prasen Palvankar
 * -----
 */

import { AppServicesProvider, RpiEvent } from '../../providers/services/app-services';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

@IonicPage()
@Component({
    selector: 'page-event-list',
    templateUrl: 'event-list.html',
})
export class EventListPage {
    private appService: AppServicesProvider;
    public eventList: RpiEvent[];
    public eventTypeIcons = {
        "Info": {
            icon: 'information-circle',
            color: 'primary'
        },
        'Warning': {
            icon: 'warning',
            color: 'danger'
        }
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, appService: AppServicesProvider) {
        this.appService = appService;
    }

    private loadEvents() {
        this.appService.getEvents()
            .subscribe(
                (events: RpiEvent[]) => {
                    this.eventList = events;
                },
                error => {
                    console.error(error);
                }
            )
    }

    getMomentTime(time: number) {
        return moment(time).fromNow();
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad EventListPage');
        this.loadEvents();

    }


}
