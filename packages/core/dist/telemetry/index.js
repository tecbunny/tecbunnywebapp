import { registerOTel } from '@vercel/otel';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';
/**
 * Registers OpenTelemetry instrumentation for a Next.js app.
 * This should be called from the `instrumentation.ts` file in the Next.js root.
 * @param serviceName The name of the service (e.g., 'api' or 'waba')
 */
export function registerTelemetry(serviceName) {
    registerOTel({
        serviceName,
    });
}
/**
 * Expose OpenTelemetry helpers for custom domain service tracing.
 */
export const telemetry = {
    trace,
    context,
    SpanStatusCode,
    /**
     * Helper to get the shared tracer for the workspace.
     */
    getTracer: (name = 'tecbunny-tracer') => trace.getTracer(name),
};
/**
 * A wrapper to execute a function within a new OpenTelemetry span.
 *
 * @param spanName The name of the span to create
 * @param fn The function to execute within the span
 * @param attributes Optional attributes to add to the span
 */
export async function withTelemetry(spanName, fn, attributes) {
    const tracer = telemetry.getTracer();
    return tracer.startActiveSpan(spanName, async (span) => {
        try {
            if (attributes) {
                span.setAttributes(attributes);
            }
            const result = await fn();
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        }
        catch (error) {
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error instanceof Error ? error.message : String(error),
            });
            span.recordException(error);
            throw error;
        }
        finally {
            span.end();
        }
    });
}
