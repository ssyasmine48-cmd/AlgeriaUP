import { NextResponse } from 'next/server'

// Simple in-memory rate limiter
const rateLimit = new Map()

export function middleware(request) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const path = request.nextUrl.pathname
    const userAgent = request.headers.get('user-agent') || ''
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')

    // 1. Bot Blocking (Basic User-Agent check)
    // Block common malicious bots/scrapers
    const badBots = ['python-requests', 'curl', 'wget', 'libwww-perl']
    if (badBots.some(bot => userAgent.toLowerCase().includes(bot))) {
        return new NextResponse(
            JSON.stringify({ error: 'Access Denied' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
        )
    }

    // 2. Strict Origin Enforcement for API Routes
    // Only allow requests from our own domain (or localhost for dev)
    if (path.startsWith('/api')) {
        const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'https://your-production-domain.com']
        const isAllowedOrigin = origin && allowedOrigins.some(o => origin.startsWith(o))
        const isAllowedReferer = referer && allowedOrigins.some(r => referer.startsWith(r))

        // In production, you might want to enforce this strictly. 
        // For now, we allow if either origin or referer matches, or if it's a direct browser navigation (no origin/referer sometimes)
        // But for API calls (fetch), browsers usually send Origin.

        // Note: We skip this check for now to avoid breaking localhost dev if headers are missing, 
        // but in a real "max security" scenario, you'd uncomment this:
        /*
        if (!isAllowedOrigin && !isAllowedReferer) {
             return new NextResponse(
                JSON.stringify({ error: 'Unauthorized Origin' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }
        */
    }

    // 3. Rate Limiting Logic
    if (path.startsWith('/api')) {
        const now = Date.now()
        const windowSize = 60 * 1000 // 1 minute

        // Different limits for different routes
        // 'auth/session' is the obfuscated visitor logger - keep strict limit
        const limit = (path.includes('discord-webhook') || path.includes('auth/session')) ? 5 : 60

        const rateLimitKey = `${ip}:${path}`
        const requestLog = rateLimit.get(rateLimitKey) || []

        // Filter out old requests
        const recentRequests = requestLog.filter(time => now - time < windowSize)

        if (recentRequests.length >= limit) {
            return new NextResponse(
                JSON.stringify({ error: 'Too many requests, please try again later.' }),
                { status: 429, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Add current request
        recentRequests.push(now)
        rateLimit.set(rateLimitKey, recentRequests)
    }

    // 4. Security Headers
    const response = NextResponse.next()

    // HSTS (Strict-Transport-Security) - Force HTTPS
    // max-age=63072000 (2 years), includeSubDomains, preload
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')

    // Prevent XSS attacks
    response.headers.set('X-XSS-Protection', '1; mode=block')

    // Prevent clickjacking (site cannot be embedded in iframes)
    response.headers.set('X-Frame-Options', 'DENY')

    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff')

    // Control referrer information
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Content Security Policy (Basic)
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
    )

    return response
}

export const config = {
    matcher: [
        // Match all API routes
        '/api/:path*',
        // Match all pages to apply security headers
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
