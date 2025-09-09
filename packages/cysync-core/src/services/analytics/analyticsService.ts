import mixpanel from 'mixpanel-browser';
import logger from '~/utils/logger';

class AnalyticsService {
  private isInitialized = false;

  public init(): void {
    if (this.isInitialized) return;

    const token = window.cysyncEnv.MIXPANEL_TOKEN;
    const isProduction = window.cysyncEnv.IS_PRODUCTION === 'true';

    if (!token) {
      logger.warn('Mixpanel token not found. Analytics will be disabled.');
      return;
    }

    if (window.cysyncEnv.IS_TEST === 'true') {
      logger.info('Test environment detected. Analytics will be disabled.');
      return;
    }

    try {
      mixpanel.init(token, {
        debug: !isProduction,
        track_pageview: false,
        autocapture: false,
        api_host: 'https://api-eu.mixpanel.com',
        persistence: 'localStorage',
      });
      this.isInitialized = true;
      logger.info('Analytics Initialized.');
    } catch (error) {
      logger.error('Failed to initialize Mixpanel', { error });
      this.isInitialized = false;
    }
  }

  public trackEvent(eventName: string, properties?: object): void {
    if (!this.isInitialized) return;
    mixpanel.track(eventName, properties);
  }

  public trackPageView(pageName: string, url: string): void {
    if (!this.isInitialized) return;
    mixpanel.track('Page View', {
      page: pageName,
      url,
      timestamp: new Date().toISOString(),
    });
  }
}

export const analyticsService = new AnalyticsService();
