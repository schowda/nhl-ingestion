export const sleep = (ms: number) => {
    console.log(`Sleeping for ${ms}`);
    return new Promise((r) => setTimeout(r, ms))
};