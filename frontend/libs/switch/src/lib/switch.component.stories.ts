import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import {
  Component,
  effect,
  inject,
  input,
  provideZonelessChangeDetection,
} from '@angular/core';

import { Theme, ThemeService } from 'theme';

import { SwitchComponent } from './switch.component';

@Component({
  selector: 'story-theme-wrapper',
  imports: [SwitchComponent],
  template: `<ng-content />`,
})
class ThemeWrapperComponent {
  private readonly themeService = inject(ThemeService);

  theme = input<string>(Theme.FlatDark);

  constructor() {
    effect(() => {
      this.themeService.changeTheme(this.theme() as Theme);
    });
  }
}

interface SwitchStoryArgs {
  selectedTheme: string;
}

const meta: Meta<SwitchStoryArgs> = {
  title: 'Switch',
  component: SwitchComponent,
  decorators: [
    applicationConfig({
      providers: [provideZonelessChangeDetection()],
    }),
    moduleMetadata({
      imports: [ThemeWrapperComponent, SwitchComponent],
    }),
  ],
  argTypes: {
    selectedTheme: {
      control: 'select',
      options: Object.values(Theme),
      description: 'Theme applied via THEME token',
    },
  },
  args: {
    selectedTheme: Theme.FlatDark,
  },
  render: (args) => ({
    props: args,
    template: `
      <story-theme-wrapper [theme]="selectedTheme">
        <lib-switch />
      </story-theme-wrapper>
    `,
  }),
};

export default meta;
type Story = StoryObj<SwitchStoryArgs>;

export const Default: Story = {
  name: 'Default / Dark',
  args: {
    selectedTheme: Theme.FlatDark,
  },
};

export const Light: Story = {
  name: 'Default / Light',
  args: {
    selectedTheme: Theme.FlatLight,
  },
};

export const AeroDark: Story = {
  name: 'Aero / Dark',
  args: {
    selectedTheme: Theme.AeroDark,
  },
};

export const AeroLight: Story = {
  name: 'Aero / Light',
  args: {
    selectedTheme: Theme.AeroLight,
  },
};
