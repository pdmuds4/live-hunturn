export default class ServerError extends Error {
    detail: string;
    route: string;
    statusCode: number;

    constructor(message: string, detail: string, route: string, statusCode: number) {
        super(message);
        this.message = message;
        this.detail = detail;
        this.route = route;
        this.statusCode = statusCode
    }
}