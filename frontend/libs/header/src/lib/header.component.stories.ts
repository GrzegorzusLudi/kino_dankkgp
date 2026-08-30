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

import { HeaderComponent } from './header.component';

@Component({
  selector: 'story-theme-wrapper',
  imports: [HeaderComponent],
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

interface HeaderStoryArgs {
  content: string;
  selectedTheme: string;
}

const meta: Meta<HeaderStoryArgs> = {
  title: 'Header',
  component: HeaderComponent,
  decorators: [
    applicationConfig({
      providers: [provideZonelessChangeDetection()],
    }),
    moduleMetadata({
      imports: [ThemeWrapperComponent, HeaderComponent],
    }),
  ],
  argTypes: {
    content: {
      control: 'text',
      description: 'Content projected into the header',
    },
    selectedTheme: {
      control: 'select',
      options: Object.values(Theme),
      description: 'Theme applied via THEME token',
    },
  },
  args: {
    content: 'Header title',
    selectedTheme: Theme.FlatDark,
  },
  render: (args) => ({
    props: args,
    template: `
      <story-theme-wrapper [theme]="selectedTheme">
        <lib-header>{{ content }}</lib-header>
      </story-theme-wrapper>
    `,
  }),
};

export default meta;

type Story = StoryObj<HeaderStoryArgs>;

export const FlatDark: Story = {
  args: {
    selectedTheme: Theme.FlatDark,
  },
};

export const FlatLight: Story = {
  args: {
    selectedTheme: Theme.FlatLight,
  },
};

export const AeroDark: Story = {
  args: {
    selectedTheme: Theme.AeroDark,
  },
};

export const AeroLight: Story = {
  args: {
    selectedTheme: Theme.AeroLight,
  },
};
