import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiUrl =
    'http://localhost:4000/relation-tuples';
  private token = 'redacted';

  constructor(private http: HttpClient) {}

  async checkRelationTuple(namespace: string, objectId: string) {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          namespace: namespace,
          object: objectId,
        },
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        'Error checking relation tuple:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${this.token}`,
    // });

    // const params = new HttpParams()
    //   .set('namespace', namespace)
    //   .set('object', objectId);

    // return this.http.get<any>(this.apiUrl, { headers, params });
  }
}
