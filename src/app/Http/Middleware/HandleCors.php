<?php

namespace App\Http\Middleware;

use Closure;

class HandleCors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $allowedOrigins = ['http://localhost:3000', 'https://laborservice5690.com', 'https://www.laborservice5690.com', 'https://www.facebook.com', 'https://connect.facebook.net'];
        $origin = $request->headers->get('Origin');

        if ($request->getMethod() === "OPTIONS") {
            // 如果是 OPTIONS 請求，則直接返回 200 狀態碼
            return response('')
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with')
                ->header('Access-Control-Allow-Credentials', 'true');
        }

        if (in_array($origin, $allowedOrigins)) {
            return $next($request)
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with')
                ->header('Access-Control-Allow-Credentials', 'true');
        }

        // 如果來源不在允許的列表中，則不設置 CORS 頭部
        return $next($request);
    }
}
