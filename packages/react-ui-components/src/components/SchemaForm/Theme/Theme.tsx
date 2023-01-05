import { ThemeProps } from '@rjsf/core';
import Fields from '../Fields';
import Widgets from '../Widgets';
import Templates from '../Templates';
import ReadOnlyValueWidget from '../Widgets/ReadOnlyValueWidget';

const widgetsCustom = {
	readOnlyValue: ReadOnlyValueWidget
};

const Theme: ThemeProps = {
	fields: Fields,
	templates: Templates,
	widgets: { ...Widgets, ...widgetsCustom }
};

export default Theme;
