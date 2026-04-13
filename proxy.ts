import { type NextRequest, NextResponse } from "next/server";

// Fonction exportée OBLIGATOIREMENT nommée "proxy".
export default function proxy(_request: NextRequest) {
  return NextResponse.next();
}
export const config = {
  matcher: ["/api/(.*)"],
};
