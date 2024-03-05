declare const localeLookupObject: {
    'en-GB': {
        isoCode: string;
        symbol: string;
        currencyUnit: string[];
        fractionalUnit: string;
    };
    'en-US': {
        isoCode: string;
        symbol: string;
        currencyUnit: string[];
        fractionalUnit: string;
    };
    'fr-FR': {
        isoCode: string;
        symbol: string;
        currencyUnit: string[];
        fractionalUnit: string;
    };
};
export default localeLookupObject;
export declare type LocaleLookupKeys = keyof typeof localeLookupObject;
