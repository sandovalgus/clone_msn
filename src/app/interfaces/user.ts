export interface User {
    nick:string;
    subnick?:string;
    age:number;
    email: string;
    friend:boolean;
    uid:any;
    status: string;
    avatar:string;
}

// export type status = 'online' | 'offline' | 'busy' | 'away'; 