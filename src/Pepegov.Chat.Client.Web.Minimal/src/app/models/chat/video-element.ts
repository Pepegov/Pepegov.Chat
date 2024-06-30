import {UserInfo} from "../auth/user-info";

export interface VideoElement {
    muted: boolean;
    srcObject: MediaStream;
    user: UserInfo;
}
