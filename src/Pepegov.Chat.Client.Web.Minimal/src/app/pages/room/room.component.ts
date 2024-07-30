import {ChatHubService} from "../../services/chat-hub.service";
import {MessageCountStreamService} from "../../services/message-count-stream.service";
import {MuteCamMicService} from "../../services/mute-cam-mic.service";
import {UserInfo} from "../../models/auth/user-info";
import {VideoElement} from "../../models/chat/video-element";
import {SimpleOpenIdService} from "../../services/openid.service";
import {OnDestroyComponent, OnLoadComponent} from "../../component.app";
import {Component} from "../../component.decoration";

import "./room.component.css"
import {getCurrentQueryParams} from "../../router";
import {SignalingPeerjsService} from "../../services/signaling-peerjs.service";
import {SignalingService} from "../../services/Interfaces/SignalingService";
import {SignalingSignalRService} from "../../services/signaling-signalr.service";

@Component({
    selector: 'app',
    templateUrl: './room.component.html',
})
export class RoomPageComponent implements OnDestroyComponent, OnLoadComponent{
    public chatHub= new ChatHubService(new MessageCountStreamService(), new MuteCamMicService())
    signalingService: SignalingService;
    public enableVideo = true;
    public enableAudio = true;
    public stream: MediaStream;
    public isMeeting: boolean;
    public currentUser: UserInfo;
    public shareScreenPeer: any;
    public shareScreenStream: any;
    public isStopRecord = false;
    public videos: VideoElement[] = [];
    public isRecorded: boolean;
    public userIsSharing: string;
    public roomId: string;
    public openIdService: SimpleOpenIdService;
    public tempvideos: VideoElement[] = [];
    public videoGridElement: HTMLDivElement;


    constructor() {
        this.openIdService = new SimpleOpenIdService()
        this.videos = []
    }

    public async OnLoad() {
        this.videoGridElement = document.querySelector('#video-grid') as HTMLDivElement;
        this.getCurrentRoomId()

        this.currentUser = await this.openIdService.GetUserInfoAsync()
        await this.createLocalStream()

        this.chatHub.createHubConnection(this.currentUser, this.roomId, this.openIdService.GetAccessTokenOnStorage()!)
        //this.signalingService = new SignalingPeerjsService(this.currentUser, this.stream, this.chatHub);
        this.signalingService = new SignalingSignalRService(this.stream);
        await this.signalingService.ConfigureUserPeer(this.roomId)
        await this.signalingService.CallGroup((id: string, otherUserVideoStream: MediaStream) => this.addOtherUserVideo(id, otherUserVideoStream));
        await this.signalingService.SubscribeUsers((id: string, otherUserVideoStream: MediaStream) => this.addOtherUserVideo(id, otherUserVideoStream),
(id ) => {
            this.videos = this.videos.filter((video) => video.id !== id);
            this.tempvideos = this.tempvideos.filter(video => video.id !== id);
        },
            (id  ) => { this.videos = this.videos.filter(video => video.id !== id);
                this.tempvideos = this.tempvideos.filter(video => video.id !== id);}    )
    }

    public OnDestroy(): void {
        this.isMeeting = false;
        //this.shareScreenPeer.destroy();
        this.signalingService.Destroy()
        this.chatHub.stopHubConnection();
        localStorage.removeItem('share-screen');
    }

    public async createLocalStream() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ video: this.enableVideo, audio: this.enableAudio });
            const localVideoPlayer = document.getElementById('local_video') as HTMLVideoElement;
            localVideoPlayer.srcObject = new MediaStream([this.stream.getVideoTracks()[0]]);
        } catch (error) {
            console.error(error);
            alert(`Can't join room, error ${error}`);
        }
    }

    public getCurrentRoomId(){
        const id = getCurrentQueryParams().get('id')
        if(id){
            this.roomId = id;
        }
        else {
            alert("\"id\" query parameter was not found")
            window.location.href = "/"
        }
    }

    public addOtherUserVideo(id: string, stream: MediaStream) {
        console.log("addOtherUserVideo ", id, stream);
        if(!this.videos){
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!3")
        }
        const alreadyExisting = this.videos.some(video => video.id === id);
        console.log("add addOtherUserVideo. alreadyExisting:" + alreadyExisting)
        if (alreadyExisting) {
            console.log(this.videos, id);
            return;
        }

        this.videos.push({
            muted: false,
            srcObject: stream,
            id: id
        });

        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.className = "video-item";
        videoElement.muted = true;
        videoElement.autoplay = true;
        this.videoGridElement.appendChild(videoElement)
    }
}