declare const localeLookupObject: {
    'en-GB': {
        n2wordsRef: string;
        isoCode: string;
        symbol: string;
        currencyUnit: string[];
        fractionalUnit: string;
    };
    'en-US': {
        n2wordsRef: string;
        isoCode: string;
        symbol: string;
        currencyUnit: string[];
        fractionalUnit: string;
    };
    'fr-FR': {
        n2wordsRef: string;
        isoCode: string;
        symbol: string;
        currencyUnit: string[];
        fractionalUnit: string;
    };
};
export default localeLookupObject;
export type LocaleLookupKeys = keyof typeof localeLookupObject;
