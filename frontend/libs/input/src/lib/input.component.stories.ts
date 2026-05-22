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

import { InputComponent } from './input.component';

@Component({
  selector: 'story-theme-wrapper',
  imports: [InputComponent],
  template: `<ng-content />`,
})
class ThemeWrapperComponent implements OnChanges {
  private readonly themeService = inject(ThemeService);
  @Input() theme: string = Theme.FlatDark;

  ngOnChanges(): void {
    this.themeService.changeTheme(this.theme as Theme);
  }
}

interface InputStoryArgs {
  label: string;
  selectedTheme: string;
}

const meta: Meta<InputStoryArgs> = {
  title: 'Input',
  component: InputComponent,
  decorators: [
    applicationConfig({
      providers: [provideZonelessChangeDetection()],
    }),
    moduleMetadata({
      imports: [ThemeWrapperComponent, InputComponent],
    }),
  ],
  argTypes: {
    label: {
      control: 'text',
      description: 'Placeholder label for the input',
    },
    selectedTheme: {
      control: 'select',
      options: Object.values(Theme),
      description: 'Theme applied via THEME token',
    },
  },
  args: {
    label: 'Enter text...',
    selectedTheme: Theme.FlatDark,
  },
  render: (args) => ({
    props: args,
    template: `
      <story-theme-wrapper [theme]="selectedTheme">
        <app-input [label]="label"></app-input>
      </story-theme-wrapper>
    `,
  }),
};

export default meta;

type Story = StoryObj<InputStoryArgs>;

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
