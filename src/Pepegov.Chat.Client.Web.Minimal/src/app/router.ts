import Navigo from 'navigo';
import {ToolbarComponent} from "./components/toolbar/toolbar.component";
import {LobbyPageComponent} from "./pages/lobby/lobby.component";
import {LoginPageComponent} from "./pages/login/login.component";
import loadNotFound from "./pages/not-found";
import {bootstrap} from "./bootstrap";
import {RoomPageComponent} from "./pages/room/room.component";

const router = new Navigo('/');

render(ToolbarComponent)
router.on({
    '/': () => render(LobbyPageComponent),
    '/login': () => render(LoginPageComponent),
    "/room": (id:string) => render(RoomPageComponent)
}).notFound((() => loadNotFound()))

export default router;

async function render(component: any){
    document.addEventListener('DOMContentLoaded', () => {
        bootstrap(component);
    });
}

export function getCurrentQueryParams(): URLSearchParams {
    const queryParams = window.location.search;
    return new URLSearchParams(queryParams);
}