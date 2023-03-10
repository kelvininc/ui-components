# *<kv-modal>*



<!-- Auto Generated Below -->


## Usage

### React

```tsx
import React from 'react';
import { ModalOverlay, useModal } from '@kelvininc/react-ui-components';
import type { ModalOverlayProps } from '@kelvininc/react-ui-components';

export const ModalOverlayExample: React.FC = (args: ModalOverlayProps) => {
	const modalController = useModal(args.isOpen);

	return (
		<>
			<button type="button" onClick={modalController.open}>
				Open Modal
			</button>
			<ModalOverlay rootId="root" {...args} isOpen={modalCtrl.isOpen} />
		</>
	);
};
```



## Properties

| Property              | Attribute                | Description                                                               | Type      | Default     |
| --------------------- | ------------------------ | ------------------------------------------------------------------------- | --------- | ----------- |
| `closeOnOverlayClick` | `close-on-overlay-click` | (optional) Defines if the modal can be closed with a click on the overlay | `boolean` | `true`      |
| `headerTitle`         | `header-title`           | (optional) Defines the modal title label                                  | `string`  | `undefined` |
| `showCloseButton`     | `show-close-button`      | (optional) Defines if the modal shows the close button                    | `boolean` | `true`      |
| `showOverlay`         | `show-overlay`           | (optional) Defines if the modal has an overlay background                 | `boolean` | `true`      |


## Events

| Event        | Description                              | Type                |
| ------------ | ---------------------------------------- | ------------------- |
| `clickClose` | Emitted when the close button is clicked | `CustomEvent<void>` |


## CSS Custom Properties

| Name                          | Description                      |
| ----------------------------- | -------------------------------- |
| `--modal-background-color`    | The modal's background color.    |
| `--modal-close-button-height` | The modal's close button height  |
| `--modal-close-button-width`  | The modal's close button width   |
| `--modal-footer-height`       | The modal's footer height in px. |
| `--modal-header-height`       | The modal's header height in px. |
| `--modal-height`              | The modal's height in px.        |
| `--modal-overlay-color`       | The modal's overlay color.       |
| `--modal-title-text-color`    | The modal's text header color.   |
| `--modal-width`               | The modal's width in px.         |
| `--modal-z-index`             | The modal's z-index              |


## Dependencies

### Depends on

- [kv-icon](../icon)

### Graph
```mermaid
graph TD;
  kv-modal --> kv-icon
  style kv-modal fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


