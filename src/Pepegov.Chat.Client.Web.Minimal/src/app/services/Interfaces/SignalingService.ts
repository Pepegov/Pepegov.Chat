import {UserInfo} from "../../models/auth/user-info";

export interface SignalingService {
    ConfigureUserPeer(roomId: string): void | Promise<void>;
    CallGroup(onStream: (id: string, otherUserVideoStream: MediaStream) => void) : void | Promise<void>;
    SubscribeUsers(
        onStream: (id: string, otherUserVideoStream: MediaStream) => void,
        onClose: (id: string) => void,
        onSubscribeOfflineUser: (id: string) => void
    ) : void | Promise<void>;
    Destroy() : void | Promise<void>;
}