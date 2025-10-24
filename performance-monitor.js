// Performance Monitoring Utility for Gardner Valley
// Tracks key metrics and helps identify bottlenecks

class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.enabled = true;
        this.maxMetrics = 100; // Limit stored metrics
    }

    // Start timing an operation
    start(label) {
        if (!this.enabled) return;
        this.metrics.set(label, {
            startTime: performance.now(),
            endTime: null,
            duration: null
        });
    }

    // End timing an operation
    end(label) {
        if (!this.enabled) return;
        const metric = this.metrics.get(label);
        if (metric) {
            metric.endTime = performance.now();
            metric.duration = metric.endTime - metric.startTime;
            
            // Log slow operations (> 1 second)
            if (metric.duration > 1000) {
                console.warn(`⚠️ Slow operation: ${label} took ${metric.duration.toFixed(2)}ms`);
            }
            
            // Limit stored metrics
            if (this.metrics.size > this.maxMetrics) {
                const firstKey = this.metrics.keys().next().value;
                this.metrics.delete(firstKey);
            }
        }
        return metric?.duration;
    }

    // Measure a function execution time
    async measure(label, fn) {
        if (!this.enabled) return fn();
        
        this.start(label);
        try {
            const result = await fn();
            this.end(label);
            return result;
        } catch (error) {
            this.end(label);
            throw error;
        }
    }

    // Get metrics summary
    getSummary() {
        const summary = {
            totalOperations: this.metrics.size,
            operations: []
        };

        this.metrics.forEach((metric, label) => {
            if (metric.duration) {
                summary.operations.push({
                    label,
                    duration: metric.duration.toFixed(2),
                    timestamp: new Date(metric.startTime).toISOString()
                });
            }
        });

        // Sort by duration (slowest first)
        summary.operations.sort((a, b) => parseFloat(b.duration) - parseFloat(a.duration));
        
        return summary;
    }

    // Get average duration for a label
    getAverage(labelPattern) {
        const matchingMetrics = [];
        this.metrics.forEach((metric, label) => {
            if (label.includes(labelPattern) && metric.duration) {
                matchingMetrics.push(metric.duration);
            }
        });

        if (matchingMetrics.length === 0) return null;
        
        const sum = matchingMetrics.reduce((a, b) => a + b, 0);
        return {
            average: (sum / matchingMetrics.length).toFixed(2),
            count: matchingMetrics.length,
            min: Math.min(...matchingMetrics).toFixed(2),
            max: Math.max(...matchingMetrics).toFixed(2)
        };
    }

    // Monitor React component render time
    logRender(componentName) {
        if (!this.enabled) return;
        const label = `render:${componentName}`;
        this.end(label);
        this.start(label);
    }

    // Log page load metrics
    logPageLoadMetrics() {
        if (!this.enabled || typeof window.performance.getEntriesByType !== 'function') {
            return;
        }

        const navigation = performance.getEntriesByType('navigation')[0];
        if (!navigation) return;

        const metrics = {
            'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
            'TCP Connection': navigation.connectEnd - navigation.connectStart,
            'Request Time': navigation.responseStart - navigation.requestStart,
            'Response Time': navigation.responseEnd - navigation.responseStart,
            'DOM Processing': navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            'Page Load': navigation.loadEventEnd - navigation.loadEventStart,
            'Total Load Time': navigation.loadEventEnd - navigation.fetchStart
        };

        console.group('📊 Page Load Metrics');
        Object.entries(metrics).forEach(([key, value]) => {
            if (value > 0) {
                console.log(`${key}: ${value.toFixed(2)}ms`);
            }
        });
        console.groupEnd();

        return metrics;
    }

    // Monitor localStorage performance
    logStorageMetrics() {
        if (!this.enabled || typeof localStorage === 'undefined') {
            return;
        }

        const start = performance.now();
        let totalSize = 0;
        let itemCount = 0;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            totalSize += key.length + value.length;
            itemCount++;
        }

        const duration = performance.now() - start;

        const metrics = {
            itemCount,
            totalSizeKB: (totalSize / 1024).toFixed(2),
            scanTimeMs: duration.toFixed(2),
            estimatedQuotaMB: 10 // Most browsers give ~10MB for localStorage
        };

        console.group('💾 LocalStorage Metrics');
        console.log(`Items: ${metrics.itemCount}`);
        console.log(`Total Size: ${metrics.totalSizeKB} KB`);
        console.log(`Scan Time: ${metrics.scanTimeMs}ms`);
        console.log(`Usage: ${((metrics.totalSizeKB / 1024 / metrics.estimatedQuotaMB) * 100).toFixed(1)}%`);
        console.groupEnd();

        return metrics;
    }

    // Check for long tasks (> 50ms blocking main thread)
    observeLongTasks() {
        if (!this.enabled || !window.PerformanceObserver) {
            return;
        }

        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn(`⚠️ Long Task detected: ${entry.duration.toFixed(2)}ms`);
                    }
                }
            });
            observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            // Some browsers don't support longtask observation
            console.log('Long task observation not supported');
        }
    }

    // Clear all metrics
    clear() {
        this.metrics.clear();
    }

    // Enable/disable monitoring
    toggle(enabled) {
        this.enabled = enabled;
        console.log(`Performance monitoring ${enabled ? 'enabled' : 'disabled'}`);
    }

    // Export metrics as JSON
    exportMetrics() {
        const data = {
            timestamp: new Date().toISOString(),
            summary: this.getSummary(),
            pageLoad: this.logPageLoadMetrics(),
            storage: this.logStorageMetrics()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `performance-metrics-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Create global instance
const perfMonitor = new PerformanceMonitor();

// Log page load metrics when page loads
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            perfMonitor.logPageLoadMetrics();
        }, 1000);
    });
}

// Expose to console for debugging
if (typeof window !== 'undefined') {
    window.perfMonitor = perfMonitor;
    console.log('💡 Performance monitor available. Try: perfMonitor.getSummary()');
}

