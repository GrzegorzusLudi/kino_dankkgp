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

import { FooterComponent } from './footer.component';

@Component({
  selector: 'story-theme-wrapper',
  imports: [FooterComponent],
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

interface FooterStoryArgs {
  selectedTheme: string;
}

const meta: Meta<FooterStoryArgs> = {
  title: 'Footer',
  component: FooterComponent,
  decorators: [
    applicationConfig({
      providers: [provideZonelessChangeDetection()],
    }),
    moduleMetadata({
      imports: [ThemeWrapperComponent, FooterComponent],
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
        <lib-footer>Footer content</lib-footer>
      </story-theme-wrapper>
    `,
  }),
};

export default meta;

type Story = StoryObj<FooterStoryArgs>;

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
