import { ComponentMeta, ComponentStory } from '@storybook/react';

import App from './App';

export default {
  title: 'Example/Picker',
  component: App,
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = () => <App />;

export const Wheels = Template.bind({});
