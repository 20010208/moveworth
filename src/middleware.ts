import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const isStudyDomain = hostname.startsWith("study.");

  if (isStudyDomain) {
    const pathname = request.nextUrl.pathname;
    // 無限ループ防止
    if (!pathname.startsWith("/study-site")) {
      const url = request.nextUrl.clone();
      url.pathname = `/study-site${pathname === "/" ? "" : pathname}`;
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-is-study", "1");
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-is-study", "1");
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|webp|gif|svg|ico|mp4|webm|woff2?|ttf|otf)).*)"],
};
