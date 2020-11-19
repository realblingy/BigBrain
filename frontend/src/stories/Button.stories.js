import React from 'react';

import { Button } from './Button';
import QuizButton from './QuizButton';

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => <Button {...args} />;
const QuizTemplate = (args) => <QuizButton {...args} />

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
};

export const Quiz = QuizTemplate.bind({});
Quiz.args = {
  color: 'black',
  name: 'Biden Vs Trump',
  numberOfQuestions: 6,
}
