declare function App<T extends Record<string, any> = Record<string, any>>(options: T & ThisType<T>): void;
declare function Page(options: Record<string, any> & ThisType<any>): void;
declare function getApp<T = any>(): T;
declare const wx: any;
