import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import CustomLoginPage from '../app/sign-in/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Login Integration Test', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
  });

  it('should handle successful login flow', async () => {
    const mockLoginResponse = {
      ok: true,
      json: async () => ({
        success: true,
        user: {
          id: '1',
          email: 'admin@example.com',
          role: 'ADMIN',
          firstName: 'Admin',
          lastName: 'User',
        },
        redirectTo: '/admin',
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockLoginResponse);

    render(<CustomLoginPage />);

    // Fill in login form
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByText(/sign in/i);

    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'password123',
        }),
      });

      expect(mockPush).toHaveBeenCalledWith('/admin');
    });
  });

  it('should handle login failure', async () => {
    const mockLoginResponse = {
      ok: false,
      json: async () => ({
        success: false,
        error: 'Invalid credentials',
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockLoginResponse);

    render(<CustomLoginPage />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByText(/sign in/i);

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    // Should not redirect on failed login
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should validate required fields', async () => {
    render(<CustomLoginPage />);

    const loginButton = screen.getByText(/sign in/i);
    fireEvent.click(loginButton);

    // Should not make API call with empty fields
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should show loading state during login', async () => {
    let resolveLogin: (value: any) => void;
    const loginPromise = new Promise(resolve => {
      resolveLogin = resolve;
    });

    (fetch as jest.Mock).mockReturnValueOnce(loginPromise);

    render(<CustomLoginPage />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByText(/sign in/i);

    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButton);

    // Check if loading state is shown
    await waitFor(() => {
      expect(loginButton).toBeDisabled();
    });

    // Resolve the promise
    resolveLogin!({
      ok: true,
      json: async () => ({
        success: true,
        user: { id: '1', email: 'admin@example.com', role: 'ADMIN' },
        redirectTo: '/admin',
      }),
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin');
    });
  });
});
