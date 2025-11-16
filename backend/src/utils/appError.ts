// for throw custom error so diffrentiate it from other error so that u can send seprate message to user based on the error u throw and the error system throwing
export class appError extends Error{
    statusCode:Number;
    constructor(message:string,statusCode:Number=400){
        super(message);
        this.statusCode=statusCode;
        this.name="appError";
    }
}