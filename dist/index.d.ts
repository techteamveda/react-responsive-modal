import React from 'react';
export interface ModalProps {
    /**
     * Control if the modal is open or not.
     */
    open: boolean;
    /**
     * Should the dialog be centered.
     *
     * Default to false.
     */
    center?: boolean;
    /**
     * Is the modal closable when user press esc key.
     *
     * Default to true.
     */
    closeOnEsc?: boolean;
    /**
     * Is the modal closable when user click on overlay.
     *
     * Default to true.
     */
    closeOnOverlayClick?: boolean;
    /**
     * Whether to block scrolling when dialog is open.
     *
     * Default to true.
     */
    blockScroll?: boolean;
    /**
     * Show the close icon.
     *
     * Default to true.
     */
    showCloseIcon?: boolean;
    /**
     * id attribute for the close icon button.
     */
    closeIconId?: string;
    /**
     * Custom icon to render (svg, img, etc...).
     */
    closeIcon?: React.ReactNode;
    /**
     * When the modal is open, trap focus within it.
     *
     * Default to true.
     */
    focusTrapped?: boolean;
    /**
     * You can specify a container prop which should be of type `Element`.
     * The portal will be rendered inside that element.
     * The default behavior will create a div node and render it at the at the end of document.body.
     */
    container?: Element | null;
    /**
     * An object containing classNames to style the modal.
     */
    classNames?: {
        root?: string;
        overlay?: string;
        overlayAnimationIn?: string;
        overlayAnimationOut?: string;
        modalContainer?: string;
        modal?: string;
        modalAnimationIn?: string;
        modalAnimationOut?: string;
        closeButton?: string;
        closeIcon?: string;
    };
    /**
     * An object containing the styles objects to style the modal.
     */
    styles?: {
        root?: React.CSSProperties;
        overlay?: React.CSSProperties;
        modalContainer?: React.CSSProperties;
        modal?: React.CSSProperties;
        closeButton?: React.CSSProperties;
        closeIcon?: React.CSSProperties;
    };
    /**
     * Animation duration in milliseconds.
     *
     * Default to 500.
     */
    animationDuration?: number;
    /**
     * ARIA role for modal
     *
     * Default to 'dialog'.
     */
    role?: string;
    /**
     * ARIA label for modal
     */
    ariaLabelledby?: string;
    /**
     * ARIA description for modal
     */
    ariaDescribedby?: string;
    /**
     * id attribute for modal
     */
    modalId?: string;
    /**
     * Callback fired when the Modal is requested to be closed by a click on the overlay or when user press esc key.
     */
    onClose: () => void;
    /**
     * Callback fired when the escape key is pressed.
     */
    onEscKeyDown?: (event: KeyboardEvent) => void;
    /**
     * Callback fired when the overlay is clicked.
     */
    onOverlayClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    /**
     * Callback fired when the Modal has exited and the animation is finished.
     */
    onAnimationEnd?: () => void;
    children?: React.ReactNode;
}
export declare const Modal: ({ open, center, blockScroll, closeOnEsc, closeOnOverlayClick, container, showCloseIcon, closeIconId, closeIcon, focusTrapped, animationDuration, classNames, styles, role, ariaDescribedby, ariaLabelledby, modalId, onClose, onEscKeyDown, onOverlayClick, onAnimationEnd, children, }: ModalProps) => React.ReactPortal | null;
export default Modal;
