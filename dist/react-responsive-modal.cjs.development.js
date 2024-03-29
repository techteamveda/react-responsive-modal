'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var ReactDom = _interopDefault(require('react-dom'));
var cx = _interopDefault(require('classnames'));
var bodyScrollLock = require('body-scroll-lock');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var CloseIcon = function CloseIcon(_ref) {
  var classes = _ref.classes,
      classNames = _ref.classNames,
      styles = _ref.styles,
      id = _ref.id,
      closeIcon = _ref.closeIcon,
      onClick = _ref.onClick;
  return React__default.createElement("button", {
    id: id,
    className: cx(classes.closeButton, classNames == null ? void 0 : classNames.closeButton),
    style: styles == null ? void 0 : styles.closeButton,
    onClick: onClick,
    "data-testid": "close-button"
  }, closeIcon ? closeIcon : React__default.createElement("svg", {
    className: classNames == null ? void 0 : classNames.closeIcon,
    style: styles == null ? void 0 : styles.closeIcon,
    width: 28,
    height: 28,
    viewBox: "0 0 36 36",
    "data-testid": "close-icon"
  }, React__default.createElement("path", {
    d: "M28.5 9.62L26.38 7.5 18 15.88 9.62 7.5 7.5 9.62 15.88 18 7.5 26.38l2.12 2.12L18 20.12l8.38 8.38 2.12-2.12L20.12 18z"
  })));
};

var isBrowser = typeof window !== 'undefined';

// https://github.com/alexandrzavalii/focus-trap-js/blob/master/src/index.js v1.1.0
var candidateSelectors = ['input', 'select', 'textarea', 'a[href]', 'button', '[tabindex]', 'audio[controls]', 'video[controls]', '[contenteditable]:not([contenteditable="false"])'];

function isHidden(node) {
  // offsetParent being null will allow detecting cases where an element is invisible or inside an invisible element,
  // as long as the element does not use position: fixed. For them, their visibility has to be checked directly as well.
  return node.offsetParent === null || getComputedStyle(node).visibility === 'hidden';
}

function getCheckedRadio(nodes, form) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked && nodes[i].form === form) {
      return nodes[i];
    }
  }
}

function isNotRadioOrTabbableRadio(node) {
  if (node.tagName !== 'INPUT' || node.type !== 'radio' || !node.name) {
    return true;
  }

  var radioScope = node.form || node.ownerDocument;
  var radioSet = radioScope.querySelectorAll('input[type="radio"][name="' + node.name + '"]');
  var checked = getCheckedRadio(radioSet, node.form);
  return checked === node || checked === undefined && radioSet[0] === node;
}

function getAllTabbingElements(parentElem) {
  var currentActiveElement = document.activeElement;
  var tabbableNodes = parentElem.querySelectorAll(candidateSelectors.join(','));
  var onlyTabbable = [];

  for (var i = 0; i < tabbableNodes.length; i++) {
    var node = tabbableNodes[i];

    if (currentActiveElement === node || !node.disabled && getTabindex(node) > -1 && !isHidden(node) && isNotRadioOrTabbableRadio(node)) {
      onlyTabbable.push(node);
    }
  }

  return onlyTabbable;
}
function tabTrappingKey(event, parentElem) {
  // check if current event keyCode is tab
  if (!event || event.key !== 'Tab') return;

  if (!parentElem || !parentElem.contains) {
    if (process && "development" === 'development') {
      console.warn('focus-trap-js: parent element is not defined');
    }

    return false;
  }

  if (!parentElem.contains(event.target)) {
    return false;
  }

  var allTabbingElements = getAllTabbingElements(parentElem);
  var firstFocusableElement = allTabbingElements[0];
  var lastFocusableElement = allTabbingElements[allTabbingElements.length - 1];

  if (event.shiftKey && event.target === firstFocusableElement) {
    lastFocusableElement.focus();
    event.preventDefault();
    return true;
  } else if (!event.shiftKey && event.target === lastFocusableElement) {
    firstFocusableElement.focus();
    event.preventDefault();
    return true;
  }

  return false;
}

function getTabindex(node) {
  var tabindexAttr = parseInt(node.getAttribute('tabindex'), 10);
  if (!isNaN(tabindexAttr)) return tabindexAttr; // Browsers do not return tabIndex correctly for contentEditable nodes;
  // so if they don't have a tabindex attribute specifically set, assume it's 0.

  if (isContentEditable(node)) return 0;
  return node.tabIndex;
}

function isContentEditable(node) {
  return node.getAttribute('contentEditable');
}

var FocusTrap = function FocusTrap(_ref) {
  var container = _ref.container;
  var refLastFocus = React.useRef();
  /**
   * Handle focus lock on the modal
   */

  React.useEffect(function () {
    var handleKeyEvent = function handleKeyEvent(event) {
      if (container == null ? void 0 : container.current) {
        tabTrappingKey(event, container.current);
      }
    };

    if (isBrowser) {
      document.addEventListener('keydown', handleKeyEvent);
    } // On mount we focus on the first focusable element in the modal if there is one


    if (isBrowser && (container == null ? void 0 : container.current)) {
      var allTabbingElements = getAllTabbingElements(container.current);

      if (allTabbingElements[0]) {
        // First we save the last focused element
        // only if it's a focusable element
        if (candidateSelectors.findIndex(function (selector) {
          var _document$activeEleme;

          return (_document$activeEleme = document.activeElement) == null ? void 0 : _document$activeEleme.matches(selector);
        }) !== -1) {
          refLastFocus.current = document.activeElement;
        }

        allTabbingElements[0].focus();
      }
    }

    return function () {
      if (isBrowser) {
        var _refLastFocus$current;

        document.removeEventListener('keydown', handleKeyEvent); // On unmount we restore the focus to the last focused element

        (_refLastFocus$current = refLastFocus.current) == null ? void 0 : _refLastFocus$current.focus();
      }
    };
  }, [container]);
  return null;
};

var modals = [];
/**
 * Handle the order of the modals.
 * Inspired by the material-ui implementation.
 */

var modalManager = {
  /**
   * Register a new modal
   */
  add: function add(newModal) {
    modals.push(newModal);
  },

  /**
   * Remove a modal
   */
  remove: function remove(oldModal) {
    modals = modals.filter(function (modal) {
      return modal !== oldModal;
    });
  },

  /**
   * When multiple modals are rendered will return true if current modal is the last one
   */
  isTopModal: function isTopModal(modal) {
    return !!modals.length && modals[modals.length - 1] === modal;
  }
};
function useModalManager(ref, open) {
  React.useEffect(function () {
    if (open) {
      modalManager.add(ref);
    }

    return function () {
      modalManager.remove(ref);
    };
  }, [open, ref]);
}

var useScrollLock = function useScrollLock(refModal, open, showPortal, blockScroll) {
  var oldRef = React.useRef(null);
  React.useEffect(function () {
    if (open && refModal.current && blockScroll) {
      oldRef.current = refModal.current;
      bodyScrollLock.disableBodyScroll(refModal.current);
    }

    return function () {
      if (oldRef.current) {
        bodyScrollLock.enableBodyScroll(oldRef.current);
        oldRef.current = null;
      }
    };
  }, [open, showPortal, refModal]);
};

var classes = {
  root: 'react-responsive-modal-root',
  overlay: 'react-responsive-modal-overlay',
  overlayAnimationIn: 'react-responsive-modal-overlay-in',
  overlayAnimationOut: 'react-responsive-modal-overlay-out',
  modalContainer: 'react-responsive-modal-container',
  modalContainerCenter: 'react-responsive-modal-containerCenter',
  modal: 'react-responsive-modal-modal',
  modalAnimationIn: 'react-responsive-modal-modal-in',
  modalAnimationOut: 'react-responsive-modal-modal-out',
  closeButton: 'react-responsive-modal-closeButton'
};
var Modal = function Modal(_ref) {
  var _classNames$overlayAn, _classNames$overlayAn2, _classNames$modalAnim, _classNames$modalAnim2;

  var open = _ref.open,
      center = _ref.center,
      _ref$blockScroll = _ref.blockScroll,
      blockScroll = _ref$blockScroll === void 0 ? true : _ref$blockScroll,
      _ref$closeOnEsc = _ref.closeOnEsc,
      closeOnEsc = _ref$closeOnEsc === void 0 ? true : _ref$closeOnEsc,
      _ref$closeOnOverlayCl = _ref.closeOnOverlayClick,
      closeOnOverlayClick = _ref$closeOnOverlayCl === void 0 ? true : _ref$closeOnOverlayCl,
      container = _ref.container,
      _ref$showCloseIcon = _ref.showCloseIcon,
      showCloseIcon = _ref$showCloseIcon === void 0 ? true : _ref$showCloseIcon,
      closeIconId = _ref.closeIconId,
      closeIcon = _ref.closeIcon,
      _ref$focusTrapped = _ref.focusTrapped,
      focusTrapped = _ref$focusTrapped === void 0 ? true : _ref$focusTrapped,
      _ref$animationDuratio = _ref.animationDuration,
      animationDuration = _ref$animationDuratio === void 0 ? 300 : _ref$animationDuratio,
      classNames = _ref.classNames,
      styles = _ref.styles,
      _ref$role = _ref.role,
      role = _ref$role === void 0 ? 'dialog' : _ref$role,
      ariaDescribedby = _ref.ariaDescribedby,
      ariaLabelledby = _ref.ariaLabelledby,
      modalId = _ref.modalId,
      onClose = _ref.onClose,
      onEscKeyDown = _ref.onEscKeyDown,
      onOverlayClick = _ref.onOverlayClick,
      onAnimationEnd = _ref.onAnimationEnd,
      children = _ref.children;
  var refModal = React.useRef(null);
  var refShouldClose = React.useRef(null);
  var refContainer = React.useRef(null); // Lazily create the ref instance
  // https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily

  if (refContainer.current === null && isBrowser) {
    refContainer.current = document.createElement('div');
  } // The value should be false for srr, that way when the component is hydrated client side,
  // it will match the server rendered content


  var _useState = React.useState(false),
      showPortal = _useState[0],
      setShowPortal = _useState[1]; // Hook used to manage multiple modals opened at the same time


  useModalManager(refModal, open); // Hook used to manage the scroll

  useScrollLock(refModal, open, showPortal, blockScroll);

  var handleOpen = function handleOpen() {
    if (refContainer.current && !container && !document.body.contains(refContainer.current)) {
      document.body.appendChild(refContainer.current);
    }

    document.addEventListener('keydown', handleKeydown);
  };

  var handleClose = function handleClose() {
    if (refContainer.current && !container && document.body.contains(refContainer.current)) {
      document.body.removeChild(refContainer.current);
    }

    document.removeEventListener('keydown', handleKeydown);
  };

  var handleKeydown = function handleKeydown(event) {
    // Only the last modal need to be escaped when pressing the esc key
    if (event.keyCode !== 27 || !modalManager.isTopModal(refModal)) {
      return;
    }

    onEscKeyDown == null ? void 0 : onEscKeyDown(event);

    if (closeOnEsc) {
      onClose();
    }
  };

  React.useEffect(function () {
    return function () {
      if (showPortal) {
        // When the modal is closed or removed directly, cleanup the listeners
        handleClose();
      }
    };
  }, [showPortal]);
  React.useEffect(function () {
    // If the open prop is changing, we need to open the modal
    // This is also called on the first render if the open prop is true when the modal is created
    if (open && !showPortal) {
      setShowPortal(true);
      handleOpen();
    }
  }, [open]);

  var handleClickOverlay = function handleClickOverlay(event) {
    if (refShouldClose.current === null) {
      refShouldClose.current = true;
    }

    if (!refShouldClose.current) {
      refShouldClose.current = null;
      return;
    }

    onOverlayClick == null ? void 0 : onOverlayClick(event);

    if (closeOnOverlayClick) {
      onClose();
    }

    refShouldClose.current = null;
  };

  var handleModalEvent = function handleModalEvent() {
    refShouldClose.current = false;
  };

  var handleAnimationEnd = function handleAnimationEnd() {
    if (!open) {
      setShowPortal(false);
    }

    onAnimationEnd == null ? void 0 : onAnimationEnd();
  };

  var containerModal = container || refContainer.current;
  var overlayAnimation = open ? (_classNames$overlayAn = classNames == null ? void 0 : classNames.overlayAnimationIn) != null ? _classNames$overlayAn : classes.overlayAnimationIn : (_classNames$overlayAn2 = classNames == null ? void 0 : classNames.overlayAnimationOut) != null ? _classNames$overlayAn2 : classes.overlayAnimationOut;
  var modalAnimation = open ? (_classNames$modalAnim = classNames == null ? void 0 : classNames.modalAnimationIn) != null ? _classNames$modalAnim : classes.modalAnimationIn : (_classNames$modalAnim2 = classNames == null ? void 0 : classNames.modalAnimationOut) != null ? _classNames$modalAnim2 : classes.modalAnimationOut;
  return showPortal && containerModal ? ReactDom.createPortal(React__default.createElement("div", {
    className: cx(classes.root, classNames == null ? void 0 : classNames.root),
    style: styles == null ? void 0 : styles.root,
    "data-testid": "root"
  }, React__default.createElement("div", {
    className: cx(classes.overlay, classNames == null ? void 0 : classNames.overlay),
    "data-testid": "overlay",
    "aria-hidden": true,
    style: _extends({
      animation: overlayAnimation + " " + animationDuration + "ms"
    }, styles == null ? void 0 : styles.overlay)
  }), React__default.createElement("div", {
    ref: refModal,
    className: cx(classes.modalContainer, center && classes.modalContainerCenter, classNames == null ? void 0 : classNames.modalContainer),
    style: styles == null ? void 0 : styles.modalContainer,
    "data-testid": "modal-container",
    onClick: handleClickOverlay
  }, React__default.createElement("div", {
    className: cx(classes.modal, classNames == null ? void 0 : classNames.modal),
    style: _extends({
      animation: modalAnimation + " " + animationDuration + "ms"
    }, styles == null ? void 0 : styles.modal),
    onMouseDown: handleModalEvent,
    onMouseUp: handleModalEvent,
    onClick: handleModalEvent,
    onAnimationEnd: handleAnimationEnd,
    id: modalId,
    role: role,
    "aria-modal": "true",
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    "data-testid": "modal"
  }, focusTrapped && React__default.createElement(FocusTrap, {
    container: refModal
  }), children, showCloseIcon && React__default.createElement(CloseIcon, {
    classes: classes,
    classNames: classNames,
    styles: styles,
    closeIcon: closeIcon,
    onClick: onClose,
    id: closeIconId
  })))), containerModal) : null;
};

exports.Modal = Modal;
exports.default = Modal;
//# sourceMappingURL=react-responsive-modal.cjs.development.js.map
