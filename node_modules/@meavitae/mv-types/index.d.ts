export type SecurityKeyObject = {
  securityKeyId: string;
  credentialId: string;
  credential?: string;
  name: string;
  notes: string;
  created: number;
  lastModified: number;
}

export type ArmoredPublicKeyObject = {
  armoredPublicKey: string;
  userId: string;
  scope: string;
}

export type IdpUser = {
  sessionId: string;
  userId: string;
  email: string;
  firstName: string;
  middleNames: string;
  lastName: string;
  address1: string;
  address2: string;
  postcode: string;
  country: string;
  avatarUrl: string;
  locale: string;
  subscribed: boolean;
  subscribedUntilDate: number;
  subscribedFeatures: number[];
  subscriptionProductId: string;
  isPrivate: boolean;
  permissions: any[];
  createdDate: number;
  rpId: string;
  challenge: string;
  lastLoginTimestamp: number;
  armoredPublicKey?: string;
	encryptedArmoredPrivateKey?: string;
	securityKeyObjects?: SecurityKeyObject[];
  authorizedUsersOfVault?: Omit<ArmoredPublicKeyObject, "armoredPublicKey">[];
  iat: number;
  exp: number;
  iss: string;
}

export type EmailAddress = {
  label: 'home' | 'cell' | 'work' | string;
  email: string;
}

export type PhoneNumber = {
  label: 'home' | 'cell' | 'work' | string;
  phoneNumber: string;
}

export type Address = {
  street: string;
  city: string;
  postalCode: string;
  region: string;
  country: string;
}

export type Contact = {
  contactId: string;
  externalId: string;
  userId: string | null;
  armoredPublicKey: string | null;
  image: string;
  about: string;
  type: string;
  firstName: string;
  middleNames: string;
  lastName: string;
  dateOfBirth: number | null;
  placeOfBirth: string;
  addresses: Array<Address>;
  emailAddresses: Array<EmailAddress>;
  phoneNumbers: Array<PhoneNumber>;
  prefix: string;
  suffix: string;
  genderType: string;
  genderIdentity: string;
  jobTitle: string;
  organisationName: string;
  website: string;
  createdDate: number;
  source: string;
  searchKey: string;
}
