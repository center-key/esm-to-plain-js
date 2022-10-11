//! esm-to-plain-js v0.1.0 ~~ https://github.com/center-key/esm-to-plain-js ~~ MIT License

export declare type Settings = {
    cd: string;
};
export declare type Options = Partial<Settings>;
export declare type Result = {
    origin: string;
    dest: string;
    length: number;
    duration: number;
};
declare const esmToPlainJs: {
    transform(sourceFile: string, targetFile: string, options: Options): Result;
};
export { esmToPlainJs };
