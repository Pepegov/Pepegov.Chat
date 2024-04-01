import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Room } from '../models/chat/room';
import { PagedList } from 'src/app/models/api-result/paged-list';
import { ApiResult } from 'src/app/models/api-result/api-result';
import {OpenIdService} from "./openid.service";

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private accountService : OpenIdService) { }

  getRooms(pageIndex: number, pageSize: number){
    return this.http.get<ApiResult<PagedList<Room>>>(this.baseUrl+'room/get-paged'+'?pageIndex='+pageIndex+'&pageSize='+pageSize,); //{ headers: this.accountService.authHeader() }
  }

  addRoom(name: string){
    return this.http.post(this.baseUrl + 'room/add?name=' + name, {});
  }

  editRoom(id: string, name: string){
    return this.http.put(this.baseUrl + 'room?id='+ id +'&editName='+name, {})
  }

  deleteRoom(id: string){
    return this.http.delete(this.baseUrl+'room/'+id);
  }

  deleteAll(){
    return this.http.delete(this.baseUrl+'room/delete-all');
  }
}
