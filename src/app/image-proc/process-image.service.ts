import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessImageService {

  constructor(private http: HttpClient) { }

  public processImage(inputImage: string){
    return this.http.post<any>(`${environment.url}/api/v1.0/img/tf-process-image`,
    {
      "image": {
        "base64": inputImage
      }
    });
  }
}
