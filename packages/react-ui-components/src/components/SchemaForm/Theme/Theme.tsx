import { ThemeProps, utils } from '@rjsf/core';
import Fields from '../Fields';
import FieldTemplate from '../FieldTemplate';
import ObjectFieldTemplate from '../ObjectFieldTemplate';
import Widgets from '../Widgets';
import ErrorList from '../ErrorList';
import ArrayFieldTemplate from '../ArrayFieldTemplate';

const { getDefaultRegistry } = utils;

const { fields, widgets } = getDefaultRegistry();

const Theme: ThemeProps = {
	ArrayFieldTemplate,
	fields: { ...fields, ...Fields },
	FieldTemplate,
	ObjectFieldTemplate,
	widgets: { ...widgets, ...Widgets },
	ErrorList
};

export default Theme;
