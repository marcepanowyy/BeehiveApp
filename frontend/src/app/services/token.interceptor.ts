import { Injectable } from '@angular/core';
import {HttpInterceptor} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor{

  intercept(req: any, next: any){

    if (req.params.has('tokenIgnore')) {
      return next.handle(req);
    }

    const tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return next.handle(tokenizedReq)
  }

}
