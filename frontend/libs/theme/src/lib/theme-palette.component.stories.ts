import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';

import { ThemePaletteComponent } from './theme-palette.component';

const meta: Meta<ThemePaletteComponent> = {
  title: 'Theme/Palette',
  component: ThemePaletteComponent,
  decorators: [
    applicationConfig({
      providers: [provideZonelessChangeDetection()],
    }),
    moduleMetadata({
      imports: [ThemePaletteComponent],
    }),
  ],
  render: () => ({
    props: {},
    template: '<lib-theme-palette />',
  }),
};

export default meta;
type Story = StoryObj<ThemePaletteComponent>;

export const Default: Story = {
  name: 'All Colors',
};
