// Performance monitoring utilities for Core Web Vitals tracking

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

export function reportWebVital(metric: PerformanceMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // Report to analytics service
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as { gtag: (...args: unknown[]) => void }).gtag;
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      custom_map: { metric_rating: metric.rating },
    });
  }
}

// Track page load performance
export function trackPageLoad() {
  if (typeof window === 'undefined') return;

  // Track Time to First Byte (TTFB)
  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigationEntry) {
    const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    reportWebVital({
      name: 'TTFB',
      value: ttfb,
      rating: getRating('TTFB', ttfb),
    });
  }

  // Track First Contentful Paint (FCP)
  const paintEntries = performance.getEntriesByType('paint');
  const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
  if (fcpEntry) {
    reportWebVital({
      name: 'FCP',
      value: fcpEntry.startTime,
      rating: getRating('FCP', fcpEntry.startTime),
    });
  }
}

// Track user interactions
export function trackInteraction(action: string, target?: string) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as { gtag: (...args: unknown[]) => void }).gtag;
    gtag('event', action, {
      event_category: 'User Interaction',
      event_label: target,
    });
  }
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Track page load metrics
  if (document.readyState === 'complete') {
    trackPageLoad();
  } else {
    window.addEventListener('load', trackPageLoad);
  }

  // Track route changes (for SPA navigation)
  let currentPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      trackInteraction('page_view', currentPath);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}