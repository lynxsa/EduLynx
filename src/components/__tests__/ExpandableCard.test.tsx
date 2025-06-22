import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DashboardGrid, ExpandableCard } from '../cards/ExpandableCard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock theme hook
const mockTheme = {
  theme: 'light' as const,
  actualTheme: 'light' as const,
  setTheme: jest.fn(),
  toggleTheme: jest.fn(),
};

jest.mock('../../styles/theme', () => ({
  useTheme: () => mockTheme,
  ThemeProvider: ({ children }: any) => children,
}));

describe('ExpandableCard', () => {
  const defaultProps = {
    children: <div>Test content</div>,
  };

  it('renders with basic content', () => {
    render(<ExpandableCard {...defaultProps} />);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with title and subtitle', () => {
    render(<ExpandableCard {...defaultProps} title="Test Title" subtitle="Test Subtitle" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('shows expand button when expandable is true', () => {
    render(<ExpandableCard {...defaultProps} expandable={true} title="Test Title" />);

    const expandButton = screen.getByRole('button');
    expect(expandButton).toBeInTheDocument();
  });

  it('does not show expand button when expandable is false', () => {
    render(<ExpandableCard {...defaultProps} expandable={false} title="Test Title" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('opens modal when expand button is clicked', async () => {
    render(<ExpandableCard {...defaultProps} expandable={true} title="Test Title" />);

    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);

    await waitFor(() => {
      expect(screen.getByText('Expanded View')).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    render(<ExpandableCard {...defaultProps} loading={true} />);
    expect(
      screen.getByTestId('card-skeleton') || document.querySelector('.animate-pulse')
    ).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(<ExpandableCard {...defaultProps} error="Test error" />);
    expect(screen.getByText('Error Loading Data')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('calls onExpand callback when expanded', async () => {
    const onExpand = jest.fn();
    render(
      <ExpandableCard {...defaultProps} expandable={true} title="Test Title" onExpand={onExpand} />
    );

    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);

    expect(onExpand).toHaveBeenCalled();
  });

  it('renders header content', () => {
    const headerContent = <div>Header Content</div>;
    render(<ExpandableCard {...defaultProps} title="Test Title" headerContent={headerContent} />);

    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('renders footer content', () => {
    const footerContent = <div>Footer Content</div>;
    render(<ExpandableCard {...defaultProps} footerContent={footerContent} />);

    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ExpandableCard {...defaultProps} className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('sets correct height based on height prop', () => {
    const { container } = render(<ExpandableCard {...defaultProps} height="lg" />);

    expect(container.firstChild).toHaveClass('h-[var(--card-height-lg)]');
  });
});

describe('DashboardGrid', () => {
  it('renders children', () => {
    render(
      <DashboardGrid>
        <div>Child 1</div>
        <div>Child 2</div>
      </DashboardGrid>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('applies custom grid columns', () => {
    const { container } = render(
      <DashboardGrid columns="1fr 2fr 1fr">
        <div>Child</div>
      </DashboardGrid>
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid.style.gridTemplateColumns).toBe('1fr 2fr 1fr');
  });

  it('applies gap classes', () => {
    const { container } = render(
      <DashboardGrid gap="lg">
        <div>Child</div>
      </DashboardGrid>
    );

    expect(container.firstChild).toHaveClass('gap-8');
  });

  it('applies custom className', () => {
    const { container } = render(
      <DashboardGrid className="custom-grid">
        <div>Child</div>
      </DashboardGrid>
    );

    expect(container.firstChild).toHaveClass('custom-grid');
  });
});
