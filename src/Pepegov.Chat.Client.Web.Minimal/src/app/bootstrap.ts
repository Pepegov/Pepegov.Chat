import {OnDestroyComponent, OnLoadComponent} from "./component.app"

function nameof<T>(name: keyof T): keyof T {
    return name;
}

export function bootstrap(component: any): Promise<void> {
    const componentInstance = new component();

    return fetch(componentInstance.templateUrl)
        .then(response => response.text())
        .then(html => {
            document.getElementById(componentInstance.selector)!.innerHTML = html;
        })
        .then(() => {
            if (nameof<OnLoadComponent>("OnLoad") in componentInstance) {
                componentInstance.OnLoad();
            }
        })
        .then(() => {
            if (nameof<OnDestroyComponent>("OnDestroy") in componentInstance) {
                window.addEventListener('beforeunload', componentInstance.OnDestroy());
            }
        })
        .catch(err => console.warn('Something went wrong: ', err));
}
