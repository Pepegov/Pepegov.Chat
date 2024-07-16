export default class HttpClient {
    accessTokenFactory: () => (string | null);

    constructor(accessTokenFactory: () => (string | null)) {
        this.accessTokenFactory = accessTokenFactory;
    }

    async GetAsync<TOut>(url: string) : Promise<TOut> {
        let headers = {}
        if(this.accessTokenFactory){
            headers = {
                Authorization: `Bearer ${this.accessTokenFactory()}`
            }
        }

        const responseData = await fetch(url, {
            method: 'GET',
            headers: headers
        })

        return await responseData.json() as TOut
    }
}