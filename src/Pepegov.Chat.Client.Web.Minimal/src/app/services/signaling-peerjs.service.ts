import {UserInfo} from "../models/auth/user-info";
import Peer from "peerjs";
import {ChatHubService} from "./chat-hub.service";
import {Subscription} from "rxjs";
import {SignalingService} from "./Interfaces/SignalingService"

export class SignalingPeerjsService implements SignalingService {
    peer: Peer;
    public currentUser: UserInfo;
    userStream: MediaStream;
    chatHub: ChatHubService;
    public subscriptions = new Subscription();

    constructor(currentUser: UserInfo, userStream: MediaStream, chatHub: ChatHubService) {
        this.currentUser = currentUser;
        this.userStream = userStream;
        this.chatHub = chatHub;
    }

    public ConfigureUserPeer(roomId: string): void {
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

    public CallGroup(onStream: (id: string, otherUserVideoStream: MediaStream) => void) {
        this.peer.on('call', (call) => {
            call.answer(this.userStream);
            call.on('stream', (otherUserVideoStream) => {
                onStream(call.metadata.user, otherUserVideoStream);
            });
            call.on('error', (err : any) => {
                console.error("call group error" + err);
            })
        });
    }

    public SubscribeUsers(
        onStream: (id: string, otherUserVideoStream: MediaStream) => void,
        onClose: (id: string) => void,
        onSubscribeOfflineUser: (id: string) => void
    ){
        this.subscriptions.add(
            this.chatHub.oneOnlineUserSource.subscribe(member => {
                if (this.currentUser.nickname !== member.nickname) {
                    // Let some time for new peers to be able to answer
                    setTimeout(() => {
                        const call = this.peer.call(member.nickname, this.userStream, {
                            metadata: { user: this.currentUser },
                        });
                        call.on('stream', (otherUserVideoStream: MediaStream) => {
                            onStream(member.nickname, otherUserVideoStream);
                        });

                        call.on('close', () => {
                            onClose(member.nickname);
                        });
                    }, 1000);
                }
            })
        );

        this.subscriptions.add(this.chatHub.oneOfflineUser$.subscribe(member => {
            onSubscribeOfflineUser(member.nickname);
        }));
    }

    Destroy(){
        this.peer.disconnect();
        this.subscriptions.unsubscribe();
    }
}
