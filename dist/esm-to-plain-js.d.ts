//! esm-to-plain-js v1.2.0 ~~ https://github.com/center-key/esm-to-plain-js ~~ MIT License

export type Settings = {
    cd: string | null;
};
export type Result = {
    origin: string;
    dest: string;
    length: number;
    duration: number;
};
declare const esmToPlainJs: {
    assert(ok: unknown, message: string | null): void;
    cli(): void;
    transform(sourceFile: string, targetFile: string, options?: Partial<Settings>): Result;
    reporter(result: Result): void;
};
export { esmToPlainJs };
