import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class DataExchangeService {
  private url = 'http://localhost:3003';  // URL to web API
  constructor(private http: Http) { }
  getSheet(week: number) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log("calling");
    return this.http.get('http://localhost:3003/getSheet').map(this.extractData);

    // return this.http.post(this.url, week)
    //   .map(this.extractData)
    //   .catch(this.handleError);
  }
  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }
  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
