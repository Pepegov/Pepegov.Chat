import {ChatHubService} from "../../services/chat-hub.service";
import {MessageCountStreamService} from "../../services/message-count-stream.service";
import {MuteCamMicService} from "../../services/mute-cam-mic.service";
import {UserInfo} from "../../models/auth/user-info";
import {Subscription} from "rxjs";
import {VideoElement} from "../../models/chat/video-element";
import Peer from "peerjs";
import {SimpleOpenIdService} from "../../services/openid.service";
import {OnDestroyComponent, OnLoadComponent} from "../../component.app";
import {Component} from "../../component.decoration";

import "./room.component.css"
import {getCurrentQueryParams} from "../../router";
import Navigo from "navigo";

@Component({
    selector: 'app',
    templateUrl: './room.component.html',
})
export class RoomPageComponent implements OnDestroyComponent, OnLoadComponent{
    chatHub = new ChatHubService(new MessageCountStreamService(), new MuteCamMicService())
    enableVideo = true;
    enableAudio = true;
    stream: MediaStream;
    isMeeting: boolean;
    currentUser: UserInfo;
    subscriptions = new Subscription();
    shareScreenPeer: any;
    shareScreenStream: any;
    enableShareScreen = true;// enable or disable button sharescreen
    isStopRecord = false;
    textStopRecord = 'Start Record';
    videos: VideoElement[] = [];
    isRecorded: boolean;
    userIsSharing: string;
    roomId: string;
    peer: Peer;
    openIdService: SimpleOpenIdService;
    tempvideos: VideoElement[] = [];
    videoGridElement: HTMLDivElement;


    constructor() {
        this.openIdService = new SimpleOpenIdService()
    }

    async OnLoad() {
        this.videoGridElement = document.querySelector('#video-grid') as HTMLDivElement;
        this.getCurrentRoomId()

        this.currentUser = await this.openIdService.GetUserInfoAsync()
        await this.createLocalStream()

        this.chatHub.createHubConnection(this.currentUser, this.roomId, this.openIdService.GetAccessTokenOnStorage()!)
        this.configureUserPeer()
        //this.configureShareScreenPeer()
        this.callGroup()
        this.subscribeUsers()
        //this.subscribeShareScreens()
    }

    OnDestroy(): void {
        this.isMeeting = false;
        this.peer.disconnect();
        this.shareScreenPeer.destroy();
        this.chatHub.stopHubConnection();
        this.subscriptions.unsubscribe();
        localStorage.removeItem('share-screen');
    }

    async createLocalStream() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ video: this.enableVideo, audio: this.enableAudio });
            const localVideoPlayer = document.getElementById('local_video') as HTMLVideoElement;
            localVideoPlayer.srcObject = new MediaStream([this.stream.getVideoTracks()[0]]);
        } catch (error) {
            console.error(error);
            alert(`Can't join room, error ${error}`);
        }
    }

    getCurrentRoomId(){
        const id = getCurrentQueryParams().get('id')
        if(id){
            this.roomId = id;
        }
        else {
            alert("\"id\" query parameter was not found")
            window.location.href = "/"
        }
    }

    configureUserPeer(){
        this.peer = new Peer(this.currentUser.nickname, {
            config: {
                'iceServers': [
                    { urls: 'stun:freeturn.net:5349' },
                    { urls: 'turns:freeturn.tel:5349', username: 'free', credential: 'free' }
                ]
            }
        });

        //open new user peer
        this.peer.on('open', (userId) => {
            console.log("open new user peer " + userId)
        });
    }

    callGroup() {
        this.peer.on('call', (call) => {
            call.answer(this.stream);
            call.on('stream', (otherUserVideoStream) => {
                this.addOtherUserVideo(call.metadata.user, otherUserVideoStream);
            });
            call.on('error', (err : any) => {
                console.error("call group error" + err);
            })
        });
    }

    addOtherUserVideo(user: UserInfo, stream: MediaStream) {
        const alreadyExisting = this.videos.some(video => video.user.nickname === user.nickname);
        console.log("add addOtherUserVideo. alreadyExisting:" + alreadyExisting)
        console.log(user)
        if (alreadyExisting) {
            console.log(this.videos, user);
            return;
        }

        this.videos.push({
            muted: false,
            srcObject: stream,
            user: user
        });

        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.className = "video-item";
        videoElement.muted = true;
        videoElement.autoplay = true;
        this.videoGridElement.appendChild(videoElement)
    }

    subscribeUsers(){
        this.subscriptions.add(
            this.chatHub.oneOnlineUser$.subscribe(member => {
                if (this.currentUser.nickname !== member.nickname) {
                    // Let some time for new peers to be able to answer
                    setTimeout(() => {
                        const call = this.peer.call(member.nickname, this.stream, {
                            metadata: { user: this.currentUser },
                        });
                        call.on('stream', (otherUserVideoStream: MediaStream) => {
                            this.addOtherUserVideo(member, otherUserVideoStream);
                        });

                        call.on('close', () => {
                            this.videos = this.videos.filter((video) => video.user.nickname !== member.nickname);
                            this.tempvideos = this.tempvideos.filter(video => video.user.nickname !== member.nickname);
                        });
                    }, 1000);
                }
            })
        );

        this.subscriptions.add(this.chatHub.oneOfflineUser$.subscribe(member => {
            this.videos = this.videos.filter(video => video.user.nickname !== member.nickname);
            this.tempvideos = this.tempvideos.filter(video => video.user.nickname !== member.nickname);
        }));
    }
}