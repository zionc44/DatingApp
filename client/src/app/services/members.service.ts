import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member.model';
import { PaginatedResult, Pagination } from '../models/pagination.model';
import { UserParams } from '../models/user-params.model';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private baseUrl: string = environment.apiUrl;
  private members: Member[] = [];
  constructor(private http: HttpClient) { }

  getMembers(userParams: UserParams): Observable<PaginatedResult<Member[]>> {
    let params = this.getPaginationHeraders(userParams);
    return this.getPaginatedResult<Member[]>(this.baseUrl + 'users',params);
  }

  private getPaginatedResult<T>(url:string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = <T>response.body;
        const paginationHeader: string | null = response.headers.get('Pagination');

        if (paginationHeader !== null) {
          paginatedResult.pagination = JSON.parse(paginationHeader);
        }
        return paginatedResult;
      })
    )
  }

  private getPaginationHeraders(userParams: UserParams) {
    let params = new HttpParams();

    params = params.append('pageNumber', userParams.pageNumber.toString());
    params = params.append('pageSize', userParams.pageSize.toString());
    params = params.append('orderBy', userParams.orderBy.toString());
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender.toString());

    return params;
  }

  getMember(username: string): Observable<Member> {
    const member = this.members.find(x => x.userName === username);
    if (member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl + "users/" + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}

