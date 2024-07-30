import {UserInfo} from "../models/auth/user-info";
import {SignalingService} from "./Interfaces/SignalingService";
import {HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from '@microsoft/signalr';
import {SimpleOpenIdService} from "./openid.service";

interface RTCIceServer {
    credential?: string | undefined;
    urls: string | string[];
    username?: string | undefined;
}

export class SignalingSignalRService implements SignalingService {
    public openIdService: SimpleOpenIdService;
    connection: HubConnection;
    userSteam: MediaStream;
    peerConnections: {[connectionId: string] : RTCPeerConnection};
    currentUser: UserInfo;
    roomId: string;
    hubUrl = process.env.hubUrl;
    servers : {iceServers: RTCIceServer[]};

    constructor(userStream: MediaStream) {
        this.userSteam = userStream;
        this.openIdService = new SimpleOpenIdService();
        this.peerConnections = {}
    }

    async ConfigureUserPeer(roomId: string)  {
        const token = this.openIdService.GetAccessTokenOnStorage();
        this.connection = new HubConnectionBuilder()
            .withUrl( this.hubUrl + 'signalinghub', {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets,
                accessTokenFactory: () => token
            })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        this.servers = {
            iceServers: [
                { urls: "stun:freeturn.net:5349" },
                { urls: 'turns:freeturn.tel:5349', username: 'free', credential: 'free' }
            ]
        };
        this.roomId = roomId;

        await this.connection.start()
            .then(() => console.log("[Signaling] connection started"))
            .catch(err => console.log("[Signaling] connection error " + err));

        await this.connection.invoke("JoinRoom", this.roomId).catch(err => console.log("[Signaling] Send JoinRoom error", err));
    }

    async Destroy() {
        await this.connection.stop();
    }

    async CallGroup(onStream: (id: string, otherUserVideoStream: MediaStream) => void) {
        console.log("[Signaling] Call group")
        this.connection.on("new_user", (connectionId) => {
            console.log("[Signaling] On new_user", connectionId);
            this.createPeerConnection(connectionId, onStream);
            this.userSteam.getTracks().forEach(track => this.peerConnections[connectionId].addTrack(track, this.userSteam));
            this.peerConnections[connectionId].createOffer().then((description) => {
                this.peerConnections[connectionId].setLocalDescription(description);
                this.connection.invoke("SendOffer", this.roomId, connectionId, description).catch(error => console.log("SendOffer error " + error))
            });
        });

        this.connection.on("offer", (connectionId, description) => {
            console.log("[Signaling] On offer", connectionId, description);
            this.createPeerConnection(connectionId, onStream);
            this.peerConnections[connectionId].setRemoteDescription(description);
            this.userSteam.getTracks().forEach(track => this.peerConnections[connectionId].addTrack(track, this.userSteam));
            this.peerConnections[connectionId].createAnswer().then((description) => {
                console.log("[Signaling] Sending offer", description);  // Добавлен лог
                this.peerConnections[connectionId].setLocalDescription(description);
                this.connection.invoke("SendAnswer", this.roomId, connectionId, description).catch(error => console.log("[Signaling] SendAnswer error " + error))
            });
        });
    }

    async createPeerConnection(connectionId: string, onStream: (id: string, otherUserVideoStream: MediaStream) => void) {
        const peerConnection = new RTCPeerConnection(this.servers);
        this.peerConnections[connectionId] = peerConnection;

        peerConnection.addEventListener("icecandidate", (event) => {
            console.log("[Signaling] Sending ICE candidate", event.candidate);  // Добавлен лог
            if (event.candidate) {
                this.connection.invoke("SendIceCandidate", this.roomId, connectionId, event.candidate)
                    .catch(error => console.log("[Signaling] SendIceCandidate error " + error))
            }
        });

        peerConnection.addEventListener('track', (event) => {
            onStream(connectionId, event.streams[0])
        });
    }

    async SubscribeUsers(onStream: (id: string, otherUserVideoStream: MediaStream) => void, onClose: (id: string) => void, onSubscribeOfflineUser: (id: string) => void) {
        this.connection.on("answer", (userId, description) => {
            this.peerConnections[userId].setRemoteDescription(description);
        });

        this.connection.on("ice_candidate", (userId, candidate) => {
            this.peerConnections[userId].addIceCandidate(new RTCIceCandidate(candidate));
        });
    }
}