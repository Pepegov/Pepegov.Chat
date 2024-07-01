import {OnDestroyComponent, OnLoadComponent} from "./component.app"

function nameof<T>(name: keyof T): keyof T {
    return name;
}

export async function bootstrap(component: any): Promise<void> {
    const componentInstance = new component();

    try {
        let response = await fetch(componentInstance.templateUrl);
        document.getElementById(componentInstance.selector)!.innerHTML = await response.text();

        if (nameof<OnLoadComponent>("OnLoad") in componentInstance) {
            await componentInstance.OnLoad();
        }

        // if (nameof<OnDestroyComponent>("OnDestroy") in componentInstance) {
        //     window.addEventListener('beforeunload', await componentInstance.OnDestroy());
        // }
    } catch (err) {
        return console.warn('Something went wrong: ', err);
    }
}
