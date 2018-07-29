import { Station, StationsResponse, StatusResponse} from './../../providers/services/app-services';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppServicesProvider } from '../../providers/services/app-services';
import * as moment from 'moment';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    public stations: Station[];
    constructor(public navCtrl: NavController, private appServices: AppServicesProvider) {
    }

    public fetchStations() {
        this.appServices.getStations()
            .subscribe(
                (resp: StationsResponse) => {
                    this.stations = resp.data;
                    console.log(resp.data);
                },
                error => {
                    console.error(error);
                }
            );

    }

    public getLastEvent(station: Station):string {
        return `${station.lastEvent.action} ${moment(station.lastEvent.eventTime).fromNow()}`;
    }

    public refresh() {
        this.fetchStations();
    }

    public switchOn(station: Station) {
        console.log(station);
        this.appServices.switchOnStation(station.id, station.switchedOn)
            .subscribe(
                (resp: StatusResponse) => {
                    this.refresh();
                    console.log(resp);
                },
                error => {
                    console.error(error);
                    station.switchedOn = !station.switchedOn;
                }
            );
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad HomePage');
        this.fetchStations();
    }


}
