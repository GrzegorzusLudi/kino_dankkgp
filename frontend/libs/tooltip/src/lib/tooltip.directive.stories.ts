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
  ViewEncapsulation,
} from '@angular/core';

import { Theme, ThemeService } from 'theme';

import { TooltipDirective } from './tooltip.directive';
import { TooltipPosition } from './tooltip-position.type';

@Component({
  selector: 'story-theme-wrapper',
  imports: [TooltipDirective],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./tooltip.flat.directive.scss', './tooltip.aero.directive.scss'],
  styles: [
    `
      story-theme-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 80px 40px;
      }
    `,
  ],
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

interface TooltipStoryArgs {
  libTooltip: string | string[];
  position: TooltipPosition;
  selectedTheme: string;
}

const meta: Meta<TooltipStoryArgs> = {
  title: 'Tooltip',
  component: TooltipDirective,
  decorators: [
    applicationConfig({
      providers: [provideZonelessChangeDetection()],
    }),
    moduleMetadata({
      imports: [ThemeWrapperComponent, TooltipDirective],
    }),
  ],
  argTypes: {
    libTooltip: {
      control: 'text',
      description: 'Text displayed inside the tooltip',
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Position of the tooltip relative to the host element',
    },
    selectedTheme: {
      control: 'select',
      options: Object.values(Theme),
      description: 'Theme applied via THEME token',
    },
  },
  args: {
    libTooltip: 'This is a tooltip',
    position: 'top',
    selectedTheme: Theme.FlatDark,
  },
  render: (args) => ({
    props: args,
    template: `
      <story-theme-wrapper [theme]="selectedTheme">
        <button [libTooltip]="libTooltip" [position]="position">Hover me</button>
      </story-theme-wrapper>
    `,
  }),
};

export default meta;

type Story = StoryObj<TooltipStoryArgs>;

export const Top: Story = {
  name: 'Top',
  args: {
    position: 'top',
    selectedTheme: Theme.FlatDark,
  },
};

export const Bottom: Story = {
  name: 'Bottom',
  args: {
    position: 'bottom',
    selectedTheme: Theme.FlatDark,
  },
};

export const Left: Story = {
  name: 'Left',
  args: {
    position: 'left',
    selectedTheme: Theme.FlatDark,
  },
};

export const Right: Story = {
  name: 'Right',
  args: {
    position: 'right',
    selectedTheme: Theme.FlatDark,
  },
};

export const FlatLight: Story = {
  name: 'Flat Light',
  args: {
    position: 'top',
    selectedTheme: Theme.FlatLight,
  },
};

export const MultiLine: Story = {
  name: 'Multi Line',
  args: {
    libTooltip: ['First line', 'Second line', 'Third line'],
    position: 'top',
    selectedTheme: Theme.FlatDark,
  },
};
