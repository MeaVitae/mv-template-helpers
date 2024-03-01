declare const groupStringLookup: {
    guardians: string;
    substituteGuardians: string;
    viewersOfMyAccount: string;
};
export default groupStringLookup;
export type GroupStringType = keyof typeof groupStringLookup;
