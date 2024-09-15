import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api(.*)', '/(.*)']);

export default clerkMiddleware((auth, request) => {
  console.log('Request URL:', request.url);
  console.log('Is public route:', isPublicRoute(request));
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Match all routes except those starting with /api and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)', // Ensure that API and trpc routes are matched
  ],
};
