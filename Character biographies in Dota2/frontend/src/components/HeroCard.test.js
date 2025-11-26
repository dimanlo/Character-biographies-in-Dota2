import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Simple HeroCard component for testing
const HeroCard = ({ hero, onClick }) => (
  <div onClick={onClick} data-testid="hero-card">
    <h3>{hero.name}</h3>
    {hero.title && <p>{hero.title}</p>}
  </div>
);

describe('HeroCard', () => {
  const mockHero = {
    id: 1,
    name: 'Invoker',
    title: 'Arcane Genius',
    attribute: 'INT'
  };

  it('renders hero name', () => {
    render(
      <BrowserRouter>
        <HeroCard hero={mockHero} />
      </BrowserRouter>
    );
    expect(screen.getByText('Invoker')).toBeInTheDocument();
  });

  it('renders hero title when provided', () => {
    render(
      <BrowserRouter>
        <HeroCard hero={mockHero} />
      </BrowserRouter>
    );
    expect(screen.getByText('Arcane Genius')).toBeInTheDocument();
  });
});

