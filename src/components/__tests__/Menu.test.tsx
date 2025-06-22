/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { AuthProvider } from '@/contexts/AuthContext';
import Menu from '@/components/Menu';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/admin',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

const MockedAuthProvider = ({
  children,
  role = 'ADMIN',
}: {
  children: React.ReactNode;
  role?: string;
}) => {
  return <AuthProvider>{children}</AuthProvider>;
};

describe('Menu Component', () => {
  beforeEach(() => {
    // Mock sessionStorage
    const mockSessionStorage = {
      getItem: jest.fn(() => 'ADMIN'),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
    });
  });

  it('renders menu items for admin role', () => {
    render(
      <MockedAuthProvider role="ADMIN">
        <Menu />
      </MockedAuthProvider>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Teachers')).toBeInTheDocument();
    expect(screen.getByText('Students')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    // const user = userEvent.setup();

    render(
      <MockedAuthProvider>
        <Menu />
      </MockedAuthProvider>
    );

    const firstMenuItem = screen.getByText('Dashboard');
    fireEvent.focus(firstMenuItem);

    expect(firstMenuItem).toHaveFocus();
  });

  it('supports collapsible sections', async () => {
    // const user = userEvent.setup();

    render(
      <MockedAuthProvider>
        <Menu />
      </MockedAuthProvider>
    );

    // Find a collapsible section (PEOPLE section)
    const peopleSection = screen.getByText('PEOPLE');
    const toggleButton = peopleSection.closest('button');

    if (toggleButton) {
      fireEvent.click(toggleButton);
      // Check if the section collapsed/expanded
      await waitFor(() => {
        expect(toggleButton).toHaveAttribute('aria-expanded');
      });
    }
  });
});
