import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditImageService {

  private imageB64 = new BehaviorSubject('');
  private imageRead = new BehaviorSubject(false);

  constructor() { }

  updateImage(image: string){
    this.imageB64.next(image);
    this.imageRead.next(false);
  }

  setAsRead(){
    this.imageRead.next(true);
  }

  getReadStatus(){
    return this.imageRead.asObservable();
  }

  getImageB64(){
    return this.imageB64.asObservable();
  }
}
