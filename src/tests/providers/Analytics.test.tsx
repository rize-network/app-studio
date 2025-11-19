import React from 'react';
import { render, screen } from '@testing-library/react';
import { AnalyticsProvider, useAnalytics } from '../../providers/Analytics';

describe('AnalyticsProvider', () => {
  const TestComponent = () => {
    const { trackEvent } = useAnalytics();

    return (
      <div>
        <button
          data-testid="track-button"
          onClick={() => trackEvent && trackEvent({ name: 'test' })}
        >
          Track
        </button>
      </div>
    );
  };

  it('should provide analytics context to children', () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    );

    expect(screen.getByTestId('track-button')).toBeInTheDocument();
  });

  it('should accept trackEvent function', () => {
    const trackEvent = jest.fn();

    render(
      <AnalyticsProvider trackEvent={trackEvent}>
        <TestComponent />
      </AnalyticsProvider>
    );

    const button = screen.getByTestId('track-button');
    button.click();

    expect(trackEvent).toHaveBeenCalledWith({ name: 'test' });
  });

  it('should work with undefined trackEvent', () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    );

    expect(() => {
      screen.getByTestId('track-button').click();
    }).not.toThrow();
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      render(<TestComponent />);
    }).toThrow();
  });

  it('should return empty object when no trackEvent provided', () => {
    const TestComp = () => {
      const analytics = useAnalytics();

      return (
        <div>
          <span data-testid="has-trackEvent">
            {typeof analytics.trackEvent === 'function'
              ? 'function'
              : 'undefined'}
          </span>
        </div>
      );
    };

    render(
      <AnalyticsProvider>
        <TestComp />
      </AnalyticsProvider>
    );

    expect(screen.getByTestId('has-trackEvent')).toHaveTextContent('undefined');
  });

  it('should handle trackEvent with different event types', () => {
    const trackEvent = jest.fn();

    const TestComp = () => {
      const { trackEvent: track } = useAnalytics();

      return (
        <div>
          <button
            onClick={() =>
              track && track({ event: 'click', data: { test: true } })
            }
          >
            Track Complex
          </button>
        </div>
      );
    };

    render(
      <AnalyticsProvider trackEvent={trackEvent}>
        <TestComp />
      </AnalyticsProvider>
    );

    screen.getByText('Track Complex').click();

    expect(trackEvent).toHaveBeenCalledWith({
      event: 'click',
      data: { test: true },
    });
  });
});

describe('useAnalytics hook', () => {
  it('should return AnalyticsConfig object', () => {
    const TestComp = () => {
      const config = useAnalytics();

      return (
        <div>
          <span data-testid="is-object">
            {typeof config === 'object' && 'ok'}
          </span>
        </div>
      );
    };

    render(
      <AnalyticsProvider>
        <TestComp />
      </AnalyticsProvider>
    );

    expect(screen.getByTestId('is-object')).toHaveTextContent('ok');
  });
});
