interface ComponentConfig {
    selector: string;
    templateUrl: string;
}

export function Component(config: ComponentConfig) {
    return function (target: any) {
        target.prototype.selector = config.selector;
        target.prototype.templateUrl = config.templateUrl;
    }
}