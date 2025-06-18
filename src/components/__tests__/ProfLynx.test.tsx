/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfLynx from '@/components/ProfLynx';

// Mock fetch for API calls
global.fetch = jest.fn();

describe('ProfLynx AI Assistant', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  const defaultProps = {
    userRole: 'Admin',
    userName: 'Test User'
  };

  it('renders the Prof Lynx button', () => {
    render(<ProfLynx {...defaultProps} />);
    
    const button = screen.getByLabelText(/prof lynx ai assistant/i);
    expect(button).toBeInTheDocument();
  });

  it('opens chat modal when button is clicked', async () => {
    render(<ProfLynx {...defaultProps} />);
    
    const button = screen.getByLabelText(/prof lynx ai assistant/i);
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/prof lynx ai assistant/i)).toBeInTheDocument();
    });
  });

  it('sends message when form is submitted', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        response: 'Hello! How can I help you today?'
      })
    });

    render(<ProfLynx {...defaultProps} />);
    
    const button = screen.getByLabelText(/prof lynx ai assistant/i);
    fireEvent.click(button);
    
    await waitFor(() => {
      const textarea = screen.getByPlaceholderText(/ask prof lynx anything/i);
      expect(textarea).toBeInTheDocument();
    });
    
    const textarea = screen.getByPlaceholderText(/ask prof lynx anything/i);
    const sendButton = screen.getByText(/send/i);
    
    fireEvent.change(textarea, { target: { value: 'Hello Prof Lynx' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/prof-lynx/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Hello Prof Lynx',
          userRole: 'Admin',
          userName: 'Test User'
        })
      });
    });
  });

  it('handles API errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<ProfLynx {...defaultProps} />);
    
    const button = screen.getByLabelText(/prof lynx ai assistant/i);
    fireEvent.click(button);
    
    await waitFor(() => {
      const textarea = screen.getByPlaceholderText(/ask prof lynx anything/i);
      fireEvent.change(textarea, { target: { value: 'Test message' } });
    });
    
    const sendButton = screen.getByText(/send/i);
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText(/sorry, i encountered an error/i)).toBeInTheDocument();
    });
  });

  it('supports keyboard navigation', async () => {
    render(<ProfLynx {...defaultProps} />);
    
    const button = screen.getByLabelText(/prof lynx ai assistant/i);
    
    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByText(/prof lynx ai assistant/i)).toBeInTheDocument();
    });
    
    // Test Escape key to close
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByText(/prof lynx ai assistant/i)).not.toBeInTheDocument();
    });
  });

  it('maintains chat history', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        response: 'AI Response'
      })
    });

    render(<ProfLynx {...defaultProps} />);
    
    const button = screen.getByLabelText(/prof lynx ai assistant/i);
    fireEvent.click(button);
    
    await waitFor(() => {
      const textarea = screen.getByPlaceholderText(/ask prof lynx anything/i);
      expect(textarea).toBeInTheDocument();
    });
    
    // Send first message
    const textarea = screen.getByPlaceholderText(/ask prof lynx anything/i);
    const sendButton = screen.getByText(/send/i);
    
    fireEvent.change(textarea, { target: { value: 'First message' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText('First message')).toBeInTheDocument();
    });
    
    // Send second message
    fireEvent.change(textarea, { target: { value: 'Second message' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText('First message')).toBeInTheDocument();
      expect(screen.getByText('Second message')).toBeInTheDocument();
    });
  });
});
