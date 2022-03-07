import { create, themes } from '@storybook/theming';
import logo from '../images/Kelvin-Color.svg';

export default create({
  base: themes.dark,
  brandTitle: 'Kelvin - UI Components',
  brandUrl: 'https://github.com/kelvininc/ui-components',
  brandImage: logo,
});
