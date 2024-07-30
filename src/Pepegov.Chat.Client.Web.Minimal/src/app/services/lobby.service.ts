import {ApiResult} from "../models/api-result/api-result";
import {PagedList} from "../models/api-result/paged-list";
import {Room} from "../models/chat/room";
import {SimpleOpenIdService} from "./openid.service";
import HttpClient from "../httpclient";

export class LobbyService {
    openIdService : SimpleOpenIdService
    httpClient: HttpClient;
    baseUrl = process.env.apiUrl;

    constructor() {
        this.openIdService = new SimpleOpenIdService()
        this.httpClient = new HttpClient(() => this.openIdService.GetAccessTokenOnStorage())
    }

    async GetRooms(pageIndex: number, pageSize: number){
        const uri = this.baseUrl+'room/get-paged'+'?pageIndex='+pageIndex+'&pageSize='+pageSize;
        let accessToken = this.openIdService.GetAccessTokenOnStorage()

        return await this.httpClient.GetAsync<ApiResult<PagedList<Room>>>(uri)
    }
}