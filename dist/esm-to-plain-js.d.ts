//! esm-to-plain-js v1.2.3 ~~ https://github.com/center-key/esm-to-plain-js ~~ MIT License

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
    version: string;
    assertOk(ok: unknown, message: string | null): void;
    transform(sourceFile: string, targetFile: string, options?: Partial<Settings>): Result;
    reporter(result: Result): void;
    cli(): void;
};
export { esmToPlainJs };
