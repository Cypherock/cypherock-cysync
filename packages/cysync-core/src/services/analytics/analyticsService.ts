import mixpanel from 'mixpanel-browser';
import logger from '~/utils/logger';
import { getKeyDB, keyValueStore } from '~/utils';

class AnalyticsService {
  private isInitialized = false;

  private isEnabled = true;

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    const rawValue = await getKeyDB().getItem('isAnalyticsAndBugReportEnabled');
    if (rawValue === null) {
      this.isEnabled = true;
      await keyValueStore.isAnalyticsAndBugReportEnabled.set(true);
    } else {
      this.isEnabled = rawValue === 'true';
    }

    if (!this.isEnabled) {
      logger.info('Analytics disabled by user preference.');
      return;
    }

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
        api_host: 'https://api.mixpanel.com',
        persistence: 'localStorage',
        property_blacklist: [
          '$browser',
          '$browser_version',
          '$region',
          '$initial_referrer',
          '$referrer',
          '$initial_referring_domain',
          '$lib_version',
          'mp_lib',
        ],
      });
      this.isInitialized = true;
      logger.info('Analytics Initialized.');
    } catch (error) {
      logger.error('Failed to initialize Mixpanel', { error });
      this.isInitialized = false;
    }
  }

  public async setEnabled(enabled: boolean): Promise<void> {
    if (this.isEnabled === enabled) return;
    this.isEnabled = enabled;
    if (enabled) {
      if (!this.isInitialized) {
        await this.init();
      }
      try {
        mixpanel.opt_in_tracking();
        logger.info('Analytics enabled (opt-in)');
      } catch (error) {
        logger.error('Failed to enable Mixpanel', { error });
      }
    } else {
      try {
        mixpanel.opt_out_tracking();
        logger.info('Analytics disabled (opt-out)');
      } catch (error) {
        logger.error('Failed to disable Mixpanel', { error });
      }
    }
  }

  public trackEvent(eventName: string, properties?: object): void {
    if (!this.isInitialized || !this.isEnabled) return;
    mixpanel.track(eventName, properties);
  }

  public trackPageView(pageName: string, url: string): void {
    if (!this.isInitialized || !this.isEnabled) return;
    mixpanel.track('Page View', {
      page: pageName,
      url,
    });
  }
}

export const analyticsService = new AnalyticsService();
