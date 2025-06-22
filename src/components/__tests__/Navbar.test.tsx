import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import Navbar from '../Navbar';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Navbar Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
  });

  it('renders user information correctly', () => {
    render(<Navbar userName="John Doe" userRole="Admin" avatarUrl="/avatar.png" />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Admin • EduLynx')).toBeInTheDocument();
  });

  it('displays notifications dropdown when bell icon is clicked', () => {
    render(<Navbar userName="John Doe" userRole="Admin" avatarUrl="/avatar.png" />);

    const notificationButton = screen.getByLabelText('Notifications');
    fireEvent.click(notificationButton);

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Mark all as read')).toBeInTheDocument();
  });

  it('displays user menu when avatar is clicked', () => {
    render(<Navbar userName="John Doe" userRole="Admin" avatarUrl="/avatar.png" />);

    const avatarButton = screen.getByRole('button', { name: /user avatar/i });
    fireEvent.click(avatarButton);

    expect(screen.getByText('View Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('handles logout functionality', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<Navbar userName="John Doe" userRole="Admin" avatarUrl="/avatar.png" />);

    // Open user menu
    const avatarButton = screen.getByRole('button', { name: /user avatar/i });
    fireEvent.click(avatarButton);

    // Click logout
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(mockPush).toHaveBeenCalledWith('/sign-in');
    });
  });

  it('handles search input changes', () => {
    render(<Navbar userName="John Doe" userRole="Admin" avatarUrl="/avatar.png" />);

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(searchInput).toHaveValue('test search');
  });
});
