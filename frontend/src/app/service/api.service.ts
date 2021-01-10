import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUri: string = 'http://localhost:8080';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {
  }


  getPosts(): Observable<any> {
    return this.http.get(`${this.baseUri}/api/timeline`);
  }

  getInitPosts(): Observable<any> {
    return this.http.get(`${this.baseUri}/api/loadInitPosts`);
  }

  getNextPosts(id): Observable<any> {
    let url = `${this.baseUri}/api/loadNextPosts`;
    return this.http.post(url, {postId: id})
      .pipe(
        catchError(this.catchError)
      )
  }


  createPost(data): Observable<any> {
    let url = `${this.baseUri}/api/post`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.catchError)
      )
  }

  catchError(error: HttpErrorResponse) {
    let errorMsg = '';
    if (error.error instanceof ErrorEvent)
      errorMsg = error.error.message;
    else
      errorMsg = `error: ${error.status}, ${error.message}`;

    console.log(errorMsg)
    return throwError(errorMsg);
  }
}
