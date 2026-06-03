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

import { TextComponent } from './text.component';

@Component({
  selector: 'story-theme-wrapper',
  imports: [TextComponent],
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

interface TextStoryArgs {
  selectedTheme: string;
}

const meta: Meta<TextStoryArgs> = {
  title: 'Text',
  component: TextComponent,
  decorators: [
    applicationConfig({
      providers: [provideZonelessChangeDetection()],
    }),
    moduleMetadata({
      imports: [ThemeWrapperComponent, TextComponent],
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
        <lib-text>The quick brown fox jumps over the lazy dog</lib-text>
      </story-theme-wrapper>
    `,
  }),
};

export default meta;

type Story = StoryObj<TextStoryArgs>;

export const FlatDark: Story = {
  name: 'Flat Dark',
  args: {
    selectedTheme: Theme.FlatDark,
  },
};

export const FlatLight: Story = {
  name: 'Flat Light',
  args: {
    selectedTheme: Theme.FlatLight,
  },
};

export const AeroDark: Story = {
  name: 'Aero Dark',
  args: {
    selectedTheme: Theme.AeroDark,
  },
};

export const AeroLight: Story = {
  name: 'Aero Light',
  args: {
    selectedTheme: Theme.AeroLight,
  },
};
