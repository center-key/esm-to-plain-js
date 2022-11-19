//! esm-to-plain-js v0.1.1 ~~ https://github.com/center-key/esm-to-plain-js ~~ MIT License

export type Settings = {
    cd: string;
};
export type Options = Partial<Settings>;
export type Result = {
    origin: string;
    dest: string;
    length: number;
    duration: number;
};
declare const esmToPlainJs: {
    transform(sourceFile: string, targetFile: string, options: Options): Result;
};
export { esmToPlainJs };
