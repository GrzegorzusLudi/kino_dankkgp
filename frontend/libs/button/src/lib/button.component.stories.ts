import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';

import { ThemeService } from 'theme';

import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Button',
  component: ButtonComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideZonelessChangeDetection(),
        ThemeService,
      ],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'ghost'],
      description: 'Visual style of the button',
    },
    height: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Height of the button',
    },
  },
  args: {
    variant: 'primary',
    height: 'medium',
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [height]="height">Button</lib-button>`,
  }),
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  name: 'Primary / Medium',
  args: {
    variant: 'primary',
    height: 'medium',
  },
};

export const PrimarySmall: Story = {
  name: 'Primary / Small',
  args: {
    variant: 'primary',
    height: 'small',
  },
};

export const Ghost: Story = {
  name: 'Ghost / Medium',
  args: {
    variant: 'ghost',
    height: 'medium',
  },
};

export const GhostSmall: Story = {
  name: 'Ghost / Small',
  args: {
    variant: 'ghost',
    height: 'small',
  },
};
