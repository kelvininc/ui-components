import { ThemeProps, utils } from '@rjsf/core';
import Fields from '../Fields';
import FieldTemplate from '../FieldTemplate';
import ObjectFieldTemplate from '../ObjectFieldTemplate';
import Widgets from '../Widgets';
import ErrorList from '../ErrorList';
import ArrayFieldTemplate from '../ArrayFieldTemplate';
import ReadOnlyValueWidget from '../Widgets/ReadOnlyValueWidget';

const { getDefaultRegistry } = utils;

const { fields, widgets } = getDefaultRegistry();

const widgetsCustom = {
	readOnlyValue: ReadOnlyValueWidget
};

const Theme: ThemeProps = {
	ArrayFieldTemplate,
	fields: { ...fields, ...Fields },
	FieldTemplate,
	ObjectFieldTemplate,
	widgets: { ...widgets, ...Widgets, ...widgetsCustom },
	ErrorList
};

export default Theme;
