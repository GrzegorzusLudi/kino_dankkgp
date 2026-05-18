import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import {
  Component,
  inject,
  Input,
  OnChanges,
  provideZonelessChangeDetection,
} from '@angular/core';

import { Theme, ThemeService } from 'theme';

import { VerticalSeparatorComponent } from './vertical-separator.component';

@Component({
  selector: 'story-theme-wrapper',
  imports: [VerticalSeparatorComponent],
  template: `<ng-content />`,
})
class ThemeWrapperComponent implements OnChanges {
  private readonly themeService = inject(ThemeService);
  @Input() theme: string = Theme.FlatDark;

  ngOnChanges(): void {
    this.themeService.changeTheme(this.theme as Theme);
  }
}

interface VerticalSeparatorStoryArgs {
  selectedTheme: string;
}

const meta: Meta<VerticalSeparatorStoryArgs> = {
  title: 'VerticalSeparator',
  component: VerticalSeparatorComponent,
  decorators: [
    applicationConfig({
      providers: [provideZonelessChangeDetection()],
    }),
    moduleMetadata({
      imports: [ThemeWrapperComponent, VerticalSeparatorComponent],
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
        <lib-vertical-separator />
      </story-theme-wrapper>
    `,
  }),
};

export default meta;

type Story = StoryObj<VerticalSeparatorStoryArgs>;

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
