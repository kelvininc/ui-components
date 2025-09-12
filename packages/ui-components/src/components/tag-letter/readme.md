# *<kv-tag-letter>*



<!-- Auto Generated Below -->


## Usage

### React

```tsx
import React from 'react';

import { KvTagLetter } from '@kelvininc/react-ui-components/client';

export const TagLetterExample: React.FC = () => (
  <>
    {/*-- Default --*/}
	<KvTagLetter label="Tag Letter" />
	
	{/*-- With Color --*/}
	<KvTagLetter label="Tag Letter" color="green" />

	{/*-- With Tag Letter --*/}
	<KvTagLetter label="Tag Letter" tagLetter="T" />
  </>
);

```



## Properties

| Property             | Attribute    | Description                    | Type     | Default     |
| -------------------- | ------------ | ------------------------------ | -------- | ----------- |
| `color`              | `color`      | (optional) Tag letter's color  | `string` | `undefined` |
| `label` _(required)_ | `label`      | (required) Tag letter's label  | `string` | `undefined` |
| `tagLetter`          | `tag-letter` | (optional) Tag letter's letter | `string` | `undefined` |


----------------------------------------------


