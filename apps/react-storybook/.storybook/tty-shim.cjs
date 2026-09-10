// Browser shim for Node's `tty` builtin.
//
// Storybook 9's instrumenter is bundled as CommonJS and, at module-eval time,
// does `const tty = require("tty"); tty.isatty(...)` to detect colour support.
// Webpack 5 does not polyfill Node core modules, and mapping `tty` to an empty
// module (`resolve.fallback.tty = false`) leaves `isatty` undefined, producing
// `TypeError: (0 , jt.isatty) is not a function` in the preview iframe.
//
// `isatty` is the only member the instrumenter touches, so a single-function
// shim is sufficient. It always reports "not a TTY", which is correct in a
// browser and disables colour output.
module.exports = {
	isatty: () => false
};
