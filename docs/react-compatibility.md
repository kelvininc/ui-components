# React consumer compatibility

`@kelvininc/react-ui-components` supports React/React DOM ^18.3.1 || ^19.0.0. Shared exports must work on the oldest supported version. Development dependencies and Storybook use React 19 and cannot establish React 18 compatibility.

Before React work, read the package manifest, lockfile and the `frontend-plugins:react-code-quality` skill. Its canonical [version reference](https://github.com/kelvininc/agents/blob/master/plugins/frontend-plugins/skills/react-code-quality/references/versions.md) explains Context7 lookup and React 18 transitions. If the installed skill is missing, read that source and report the host/version gap.

Use React 18 documentation for shared code. Keep forwardRef/memo contracts and existing controlled/uncontrolled APIs. Newer APIs require an explicit supported-entry or migration decision. Keep visual animations within the approved Motion/design contract; the View Transitions skill is deferred.

Run `pnpm react:check` after building packages. The consumer fixture uses isolated React/runtime/type resolutions for each supported major; repository overrides must not force React 19 types into its React 18 check. The fixture checks published declarations and exercises a real authored component with the selected runtime.

React 18 support ends after Core UI has completed its React 19 migration. In that follow-up, raise the package peer dependency minimum to React 19, remove the React 18 API guard and consumer fixture, and update this guide and the CI matrix together. Until then, keep both supported majors covered.
