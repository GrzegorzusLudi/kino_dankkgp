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

import { TitleComponent } from './title.component';

@Component({
  selector: 'story-theme-wrapper',
  imports: [TitleComponent],
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

interface TitleStoryArgs {
  selectedTheme: string;
}

const meta: Meta<TitleStoryArgs> = {
  title: 'Title',
  component: TitleComponent,
  decorators: [
    applicationConfig({
      providers: [provideZonelessChangeDetection()],
    }),
    moduleMetadata({
      imports: [ThemeWrapperComponent, TitleComponent],
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
        <lib-title>Kino</lib-title>
      </story-theme-wrapper>
    `,
  }),
};

export default meta;

type Story = StoryObj<TitleStoryArgs>;

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
