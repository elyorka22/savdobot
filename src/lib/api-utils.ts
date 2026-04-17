import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { apiResponseSchema, ApiResponse } from "./validations";

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Validation error handler
export function handleValidationError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    const errorMessages = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        details: errorMessages,
      },
      { status: 400 }
    );
  }

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Unknown error
  console.error("API Error:", error);
  return NextResponse.json(
    {
      success: false,
      error: "Internal server error",
    },
    { status: 500 }
  );
}

// Success response helper
export function createSuccessResponse<T>(data: T, message?: string): NextResponse {
  const response: ApiResponse = {
    success: true,
    data,
    message,
  };

  return NextResponse.json(response);
}

// Error response helper
export function createErrorResponse(message: string, statusCode: number = 400, code?: string): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: message,
    code,
  };

  return NextResponse.json(response, { status: statusCode });
}

// Request validation wrapper
export function validateRequest<T>(schema: { parse: (data: unknown) => T }) {
  return (data: unknown): T => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ApiError("Validation failed", 400, "VALIDATION_ERROR");
      }
      throw error;
    }
  };
}

// Rate limiting in-memory store (for development)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean up old entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }

  const existing = rateLimitStore.get(identifier);
  
  if (!existing || existing.resetTime < now) {
    // New window
    const resetTime = now + windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetTime };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: existing.resetTime };
  }

  existing.count++;
  return { allowed: true, remaining: limit - existing.count, resetTime: existing.resetTime };
}

// Generic middleware type that works with both Request and NextRequest
type HandlerFunction<T extends Request = Request> = (req: T) => Promise<Response>;

// IP-based rate limiting middleware
export function withRateLimit<T extends Request = Request>(
  handler: HandlerFunction<T>, 
  options?: {
    limit?: number;
    windowMs?: number;
  }
) {
  return async (req: T): Promise<Response> => {
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    const limit = options?.limit || 100;
    const windowMs = options?.windowMs || 15 * 60 * 1000;
    
    const rateLimitResult = checkRateLimit(ip, limit, windowMs);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests",
          code: "RATE_LIMIT_EXCEEDED",
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    const response = await handler(req);
    
    // Add rate limit headers to successful responses
    if (response instanceof Response) {
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
    }
    
    return response;
  };
}

// Authentication middleware
export function withAuth<T extends Request = Request>(handler: HandlerFunction<T>) {
  return async (req: T): Promise<Response> => {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse("Unauthorized: Missing or invalid token", 401, "UNAUTHORIZED");
    }

    const token = authHeader.substring(7);
    
    // For now, we'll use a simple token validation
    // In production, this should validate JWT or similar
    const expectedToken = process.env.API_TOKEN;
    
    if (!expectedToken || token !== expectedToken) {
      return createErrorResponse("Unauthorized: Invalid token", 401, "INVALID_TOKEN");
    }

    return handler(req);
  };
}

// CORS middleware
export function withCors<T extends Request = Request>(handler: HandlerFunction<T>) {
  return async (req: T): Promise<Response> => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const response = await handler(req);
    
    // Add CORS headers to all responses
    if (response instanceof Response) {
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    
    return response;
  };
}
