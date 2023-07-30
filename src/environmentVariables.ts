class Env{
    public static readonly MONGODB_URI:string = process.env["MONGODB_URI"];
    public static readonly API_PUBLIC_KEY:string = process.env["API_PUBLIC_KEY"];
    public static readonly API_PRIVATE_KEY:string = process.env["API_PRIVATE_KEY"];
}

export default Env;