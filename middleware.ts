import { auth } from "@/auth";
import { withoutSignPath } from "./lib/utils";

export default auth((req) => {
  if (!req.auth && !withoutSignPath.test(req.nextUrl.pathname)) {
    const newUrl = new URL("/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
