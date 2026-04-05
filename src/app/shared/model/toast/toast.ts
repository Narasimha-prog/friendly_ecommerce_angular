import { Injectable } from '@angular/core';
import { AlertType, ToastInfo } from './toast-info.model';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Toast {

  toasts: ToastInfo[] = [];

  show(body:string,type:AlertType,timeOut=5000){
    const toastInfo: ToastInfo = { body, type };
    this.toasts.push(toastInfo);

    of(toastInfo)
    .pipe(delay(timeOut))
    .subscribe(() => {
      this.remove(toastInfo);
    });
  }

  
  remove(toastInfo: ToastInfo) {
    this.toasts = this.toasts.filter(t => t !== toastInfo);
  }
  
}


