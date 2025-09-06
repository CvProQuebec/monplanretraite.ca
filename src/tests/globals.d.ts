/* Test environment globals shim for TypeScript without @types/jest */
declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void | Promise<void>): void;
declare function expect(actual: any): any;
