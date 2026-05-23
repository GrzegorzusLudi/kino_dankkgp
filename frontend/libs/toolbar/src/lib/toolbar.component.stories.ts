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

import { ToolbarComponent } from './toolbar.component';

@Component({
  selector: 'story-theme-wrapper',
  imports: [ToolbarComponent],
  template: `<ng-content />`,
})
class ThemeWrapperComponent implements OnChanges {
  private readonly themeService = inject(ThemeService);
  @Input() theme: string = Theme.FlatDark;

  ngOnChanges(): void {
    this.themeService.changeTheme(this.theme as Theme);
  }
}

interface ToolbarStoryArgs {
  selectedTheme: string;
}

const meta: Meta<ToolbarStoryArgs> = {
  title: 'Toolbar',
  component: ToolbarComponent,
  decorators: [
    applicationConfig({
      providers: [provideZonelessChangeDetection()],
    }),
    moduleMetadata({
      imports: [ThemeWrapperComponent, ToolbarComponent],
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
        <lib-toolbar>Toolbar content</lib-toolbar>
      </story-theme-wrapper>
    `,
  }),
};

export default meta;

type Story = StoryObj<ToolbarStoryArgs>;

export const Default: Story = {};
