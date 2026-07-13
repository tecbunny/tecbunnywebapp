import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { APIResponseBuilder } from '../api-response';
import { logger } from '../logger';

export type ValidatedHandler<T> = (
  req: NextRequest,
  data: T,
  context?: any
) => Promise<NextResponse>;

export function withValidation<T>(
  schema: z.Schema<T>,
  handler: ValidatedHandler<T>
) {
  return async (req: NextRequest, context?: any) => {
    try {
      // Handle missing body gracefully for GET/DELETE
      const isReadMethod = req.method === 'GET' || req.method === 'DELETE';
      let payload;
      
      if (isReadMethod) {
        // Parse searchParams for GET/DELETE
        const url = new URL(req.url);
        payload = Object.fromEntries(url.searchParams.entries());
      } else {
        // Parse JSON body for POST/PUT/PATCH
        payload = await req.json().catch(() => ({}));
      }

      const parsed = await schema.safeParseAsync(payload);

      if (!parsed.success) {
        logger.warn('api_validation_failed', { 
          path: req.nextUrl.pathname, 
          errors: parsed.error.format() 
        });
        
        return APIResponseBuilder.error('VALIDATION_ERROR', 'Invalid request payload', 400, {
          details: parsed.error.format()
        });
      }

      // Payload is valid, proceed to actual handler
      return await handler(req, parsed.data, context);
      
    } catch (error) {
      logger.error('api_validation_unhandled', {
        path: req.nextUrl.pathname,
        error: error instanceof Error ? error.message : String(error)
      });
      return APIResponseBuilder.internalServerError('Internal validation error');
    }
  };
}
