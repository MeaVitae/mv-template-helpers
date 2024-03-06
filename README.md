# mv-template-helpers

# Usage

```

import mvTemplateEngine from '@meavitae/mv-template-helpers'

const renderedTemplate = await mvTemplateEngine(template, data)

```

## Helpers

### Tags

```

{% toc %}

{% majorNum This is the title for my major num %}

{% minorNum %}

{% subMinorNum %}

{% pageBreak %}

```

### Filters

```

{{ 3455 | numberToWords: 'en-GB' }}

{{ object.moneyValue | numberToMoneyWords: 'en-US' }}

{{ 34252354 | formatDate }}

{{ 2344.23 | formatMoney: 'en-GB' }}

{{ contactObject | fullName }}

{{ contactObject.addresses | address }}

{{ contactObject.phoneNumbers | phoneNumber }}

{{ contactObject.emailAddresses | emailAddress }}

{{ 'female' | genderLookup }}

{{ 'guardians' | groupNameRelationship }}

{{ arrayOfContacts | contactsToNameAndAddressString }}

{{ 'change this string to titlecase' | titlecase }}

```