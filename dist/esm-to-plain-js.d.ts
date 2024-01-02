//! esm-to-plain-js v1.1.2 ~~ https://github.com/center-key/esm-to-plain-js ~~ MIT License

export type Settings = {
    cd: string;
};
export type Result = {
    origin: string;
    dest: string;
    length: number;
    duration: number;
};
declare const esmToPlainJs: {
    transform(sourceFile: string, targetFile: string, options?: Partial<Settings>): Result;
    reporter(result: Result): void;
};
export { esmToPlainJs };
