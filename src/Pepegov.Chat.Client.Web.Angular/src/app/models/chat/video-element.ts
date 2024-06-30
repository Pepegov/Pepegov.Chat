import {UserInfo} from "../../services/openid.service";

export interface VideoElement {
    muted: boolean;
    srcObject: MediaStream;
    user: UserInfo;
}
