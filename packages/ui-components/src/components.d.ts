/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { EActionButtonType } from "./components/action-button/action-button.types";
export namespace Components {
    interface KvActionButton {
        "buttonClass": string;
        "buttonId": string;
        "enabled": boolean;
        "fixedWidth": number;
        "icon": string;
        "smallSize": boolean;
        "text": string;
        "type": EActionButtonType;
    }
}
declare global {
    interface HTMLKvActionButtonElement extends Components.KvActionButton, HTMLStencilElement {
    }
    var HTMLKvActionButtonElement: {
        prototype: HTMLKvActionButtonElement;
        new (): HTMLKvActionButtonElement;
    };
    interface HTMLElementTagNameMap {
        "kv-action-button": HTMLKvActionButtonElement;
    }
}
declare namespace LocalJSX {
    interface KvActionButton {
        "buttonClass"?: string;
        "buttonId"?: string;
        "enabled"?: boolean;
        "fixedWidth"?: number;
        "icon"?: string;
        "onButtonClick"?: (event: CustomEvent<MouseEvent>) => void;
        "smallSize"?: boolean;
        "text"?: string;
        "type": EActionButtonType;
    }
    interface IntrinsicElements {
        "kv-action-button": KvActionButton;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "kv-action-button": LocalJSX.KvActionButton & JSXBase.HTMLAttributes<HTMLKvActionButtonElement>;
        }
    }
}