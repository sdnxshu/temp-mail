// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { generateEmail } from "@/utils/generate-email";

export function proxy(request: NextRequest) {
    const response = NextResponse.next();
    if (!request.cookies.get("email")) {
        response.cookies.set("email", generateEmail(), {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
        });
    }
    return response;
}