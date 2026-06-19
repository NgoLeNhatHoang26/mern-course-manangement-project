import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignInPage from '../SignInPage.jsx';

const loginMock = vi.fn().mockResolvedValue({ success: false, message: 'Invalid credentials' });

vi.mock('@features/auth', () => ({
  useAuthActions: () => ({
    login: loginMock,
  }),
}));

describe('SignInPage', () => {
  it('shows validation errors for empty submit', async () => {
    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(await screen.findByText(/email hop le/i)).toBeInTheDocument();
    expect(await screen.findByText(/toi thieu 6 ky tu/i)).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });
});
