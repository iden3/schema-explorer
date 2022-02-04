import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators'
import {LoadingService} from "./loading.service";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";


/**
 * This class is for intercepting http requests. When a request starts, we set the loadingSub property
 * in the LoadingService to true. Once the request completes and we have a response, set the loadingSub
 * property to false. If an error occurs while servicing the request, set the loadingSub property to false.
 * @class {HttpRequestInterceptor}
 */
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(
    private loadingService: LoadingService,
    private snackBar: MatSnackBar
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.setLoading(true);

    return next.handle(request)

      .pipe(
        map(evt => {
          if (evt instanceof HttpResponse) {
            this.loadingService.setLoading(false);
          }
          return evt;
        }),
        catchError((err) => {
          this.snackBar.open('Error occurred, try again later', '', { duration: 2000} as MatSnackBarConfig)
          console.log(err)
          this.loadingService.setLoading(false);
          return of(err);
        })
      );
  }
}
