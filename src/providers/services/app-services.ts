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
 * Created Date: Monday, July 23rd 2018, 10:43:56 pm
 *
 * Author: Prasen Palvankar
 *
 * -----
 * Last Modified: Sat Jul 28 2018
 * Modified By: Prasen Palvankar
 * -----
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StorageServiceProvider, StorageTypes, Settings } from './../storage-service/storage-service';
import { Events } from 'ionic-angular';


export interface EventsFilter {
    deviceId?: string;
    fromDate?: number;
    toDate?: number;
    type?: string;
    source?: string;
};

/**
 * An event
 *
 * @export
 * @interface Event
 */
export interface RpiEvent {
    eventTime: number;
    eventSource: string;
    type: string;
    deviceId?: string;
    text: string;
}

export interface StationsResponse {
    status: string;
    data: Station[];
}

export interface StatusResponse {
    status: string;
    error?: any;
}

export interface Station {
    id: string;
    name: string;
    type: string;
    enabled: boolean;
    maxTime: number;
    gpioPin: number;
    lastEvent: {
        eventTime: number;
        action: string;
    },
    switchedOn: boolean;
    scheduleCount: number;
}

export interface GetScheduleListResponse {
    status: string;
    error?: any,
    data?: Schedule[];
}
export interface GetScheduleResponse {
    status: string;
    error?: any,
    data?: Schedule;
}


export interface Schedule {
    name: string;
    description: string;
    deviceId: string;
    action: string;
    active: boolean;
    rule: Rule;
    duration: number;
}

export interface Rule {
    recurs: boolean;
    year: number | null;
    month: null | number;
    date: null | number;
    dayOfWeek: null | number[];
    hour: null | number;
    minute: number;
    second: number;
}

@Injectable()
export class AppServicesProvider {
    private httpClient: HttpClient;
    private serverUrl = "http://controller-pi.local:9900";

    constructor(public http: HttpClient, private storageService: StorageServiceProvider,
        private events: Events) {

        this.httpClient = http;
        this.loadSettings();

        this.events.subscribe('settings:updated', ()=> {
            this.loadSettings();
        })
    }

    private async loadSettings() {
        console.debug('loadSettings()');
        let settings:Settings = await this.storageService.getData(StorageTypes.Settings);
        if (settings) {
            this.serverUrl = settings.controllerUrl;
        }

    }

    public getServerUrl(): string {
        return this.serverUrl;
    }

    public setServerUrl(url: string) {
        this.serverUrl = url;
    }

    public getEvents(filter?: EventsFilter): Observable<RpiEvent[]> {
        return this.httpClient.get<RpiEvent[]>(`${this.serverUrl}/api/events`);
    }

    public getStations(): Observable<StationsResponse> {
        return this.httpClient.get<StationsResponse>(`${this.serverUrl}/api/controller/stations`);
    }

    public switchOnStation(stationId: string, state: boolean): Observable<StatusResponse> {
        return this.httpClient.put<StatusResponse>(`${this.serverUrl}/api/controller/stations/${stationId}/operation`, {
            action: state ? "on" : "off"
        });
    }

    public getSchedules(): Observable<GetScheduleListResponse> {
        return this.httpClient.get<GetScheduleListResponse>(`${this.serverUrl}/api/schedules`);
    }

    public getSchedule(name: string): Observable<GetScheduleResponse> {
        return this.httpClient.get<GetScheduleResponse>(`${this.serverUrl}/api/schedules/${name}`);
    }

    public deleteSchedule(name: string): Observable<StatusResponse> {
        return this.httpClient.delete<StatusResponse>(`${this.serverUrl}/api/schedules/${name}`);
    }

    public updateSchedule(schedule: Schedule): Observable<StatusResponse> {
        return this.httpClient.put<StatusResponse>(`${this.serverUrl}/api/schedules/${schedule.name}`, schedule);
    }


}
