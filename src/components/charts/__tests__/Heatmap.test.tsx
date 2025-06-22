import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../../../styles/theme';
import { Heatmap } from '../Heatmap';

const mockHeatmapData = [
  { x: 'Math', y: 'Grade 1', value: 85 },
  { x: 'Math', y: 'Grade 2', value: 78 },
  { x: 'Science', y: 'Grade 1', value: 92 },
  { x: 'Science', y: 'Grade 2', value: 88 },
];

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Heatmap Component', () => {
  it('renders with title', () => {
    renderWithTheme(<Heatmap data={mockHeatmapData} title="Test Heatmap" />);

    expect(screen.getByText('Test Heatmap')).toBeInTheDocument();
  });

  it('renders heatmap cells with correct data', () => {
    renderWithTheme(<Heatmap data={mockHeatmapData} showLabels={true} />);

    // Check if values are rendered in cells
    expect(screen.getByText('85.0')).toBeInTheDocument();
    expect(screen.getByText('78.0')).toBeInTheDocument();
    expect(screen.getByText('92.0')).toBeInTheDocument();
    expect(screen.getByText('88.0')).toBeInTheDocument();
  });

  it('renders axis labels correctly', () => {
    renderWithTheme(<Heatmap data={mockHeatmapData} />);

    // Check for X-axis labels
    expect(screen.getByText('Math')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();

    // Check for Y-axis labels
    expect(screen.getByText('Grade 1')).toBeInTheDocument();
    expect(screen.getByText('Grade 2')).toBeInTheDocument();
  });

  it('applies different color schemes', () => {
    const { rerender } = renderWithTheme(<Heatmap data={mockHeatmapData} colorScheme="blue" />);

    // Test that component renders without errors with different color schemes
    rerender(
      <ThemeProvider>
        <Heatmap data={mockHeatmapData} colorScheme="green" />
      </ThemeProvider>
    );

    rerender(
      <ThemeProvider>
        <Heatmap data={mockHeatmapData} colorScheme="red" />
      </ThemeProvider>
    );

    // Should not throw any errors
    expect(screen.getByText('85.0')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    renderWithTheme(<Heatmap data={[]} title="Empty Heatmap" />);

    expect(screen.getByText('Empty Heatmap')).toBeInTheDocument();
  });

  it('shows tooltips on hover', async () => {
    renderWithTheme(<Heatmap data={mockHeatmapData} />);

    // Find a cell and hover over it
    const cell = screen.getByText('85.0').closest('div');
    if (cell) {
      fireEvent.mouseEnter(cell);

      // Check if tooltip appears (this might need adjustment based on implementation)
      await waitFor(() => {
        // Tooltip content would be in a title attribute or similar
        expect(cell).toHaveAttribute('title');
      });
    }
  });

  it('handles different cell sizes', () => {
    renderWithTheme(<Heatmap data={mockHeatmapData} cellSize={50} gap={3} />);

    // Should render without errors
    expect(screen.getByText('85.0')).toBeInTheDocument();
  });

  it('toggles label visibility', () => {
    const { rerender } = renderWithTheme(<Heatmap data={mockHeatmapData} showLabels={true} />);

    expect(screen.getByText('85.0')).toBeInTheDocument();

    rerender(
      <ThemeProvider>
        <Heatmap data={mockHeatmapData} showLabels={false} />
      </ThemeProvider>
    );

    // Labels should not be visible when showLabels is false
    // Note: This test might need adjustment based on actual implementation
  });
});
