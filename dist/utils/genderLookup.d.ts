declare const genderLookup: {
    male: {
        personalPronounSubject: string;
        personalPronounObject: string;
        possessivePronoun: string;
    };
    female: {
        personalPronounSubject: string;
        personalPronounObject: string;
        possessivePronoun: string;
    };
    other: {
        personalPronounSubject: null;
        personalPronounObject: null;
        possessivePronoun: null;
    };
    none: {
        personalPronounSubject: null;
        personalPronounObject: null;
        possessivePronoun: null;
    };
    unknown: {
        personalPronounSubject: null;
        personalPronounObject: null;
        possessivePronoun: null;
    };
};
export default genderLookup;
export type GenderType = keyof typeof genderLookup;
