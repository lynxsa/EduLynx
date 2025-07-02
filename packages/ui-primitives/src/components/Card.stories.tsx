import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Content to be displayed inside the card',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a default card component.',
  },
};

export const WithCustomContent: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-2">Card Title</h3>
        <p className="text-muted-foreground">
          This card contains custom content with a title and description.
        </p>
      </div>
    ),
  },
};

export const Dashboard: Story = {
  args: {
    children: (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Students</h3>
          <span className="text-2xl font-bold text-primary">1,234</span>
        </div>
        <p className="text-sm text-muted-foreground">↑ 12% from last month</p>
      </div>
    ),
  },
};
