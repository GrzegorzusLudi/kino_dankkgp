import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  provideZonelessChangeDetection,
} from '@angular/core';

import { Theme, ThemeService } from 'theme';

import { ButtonComponent } from './button.component';

@Component({
  selector: 'story-theme-wrapper',
  imports: [ButtonComponent],
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ThemeWrapperComponent {
  readonly theme = input<string>(Theme.FlatDark);

  private readonly themeService = inject(ThemeService);

  constructor() {
    effect(() => {
      this.themeService.changeTheme(this.theme() as Theme);
    });
  }
}

interface ButtonStoryArgs {
  variant: 'primary' | 'ghost';
  height: 'small' | 'medium';
  selectedTheme: string;
}

const meta: Meta<ButtonStoryArgs> = {
  title: 'Button',
  component: ButtonComponent,
  decorators: [
    applicationConfig({
      providers: [provideZonelessChangeDetection()],
    }),
    moduleMetadata({
      imports: [ThemeWrapperComponent, ButtonComponent],
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
    selectedTheme: {
      control: 'select',
      options: Object.values(Theme),
      description: 'Theme applied via THEME token',
    },
  },
  args: {
    variant: 'primary',
    height: 'medium',
    selectedTheme: Theme.FlatDark,
  },
  render: (args) => ({
    props: args,
    template: `
      <story-theme-wrapper [theme]="selectedTheme">
        <lib-button [variant]="variant" [height]="height">Button</lib-button>
      </story-theme-wrapper>
    `,
  }),
};

export default meta;
type Story = StoryObj<ButtonStoryArgs>;

export const Primary: Story = {
  name: 'Primary / Medium',
  args: {
    variant: 'primary',
    height: 'medium',
    selectedTheme: Theme.FlatDark,
  },
};

export const PrimarySmall: Story = {
  name: 'Primary / Small',
  args: {
    variant: 'primary',
    height: 'small',
    selectedTheme: Theme.FlatDark,
  },
};

export const Ghost: Story = {
  name: 'Ghost / Medium',
  args: {
    variant: 'ghost',
    height: 'medium',
    selectedTheme: Theme.FlatLight,
  },
};

export const GhostSmall: Story = {
  name: 'Ghost / Small',
  args: {
    variant: 'ghost',
    height: 'small',
    selectedTheme: Theme.FlatLight,
  },
};
