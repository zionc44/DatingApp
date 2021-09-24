import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResult } from "../models/pagination.model";
import { UserParams } from "../models/user-params.model";

export function getPaginatedResult<T>(url: string, params: HttpParams, http: HttpClient) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return http.get<T>(url, { observe: 'response', params }).pipe(
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

export function getPaginationHeraders(userParams: UserParams) {
    let params = new HttpParams();

    params = params.append('pageNumber', userParams.pageNumber.toString());
    params = params.append('pageSize', userParams.pageSize.toString());

    return params;
}