// "use server"
// import { jwtDecode } from "jwt-decode";
// import { NextResponse, NextRequest } from "next/server";

// const protectedPaths = [
//     /\/my-account(?!\/(lost-password|change-password))(.*)/, // Protect all except the specified exclusions
//     /\/checkout\/(.*)/,

// ];

// const adminPaths = [
//     /\/admin\/(.*)/,
// ]

// const auth = [
//     "/my-account/lost-password",
//     "/my-account/change-password",
// ];

// export async function middleware(request: NextRequest) {
//     const token = request.cookies.get("token")?.value;

//     const isProtected = protectedPaths.some((path) => path.test(request.nextUrl.pathname));
//     const isAuth = auth.includes(request.nextUrl.pathname);
//     const isAdmin = adminPaths.some((path) => path.test(request.nextUrl.pathname));

//     if (request.nextUrl.pathname === "/my-account") {
//         return NextResponse.next();
//     }


//     if (!token && isProtected) {
//         const url = new URL("/my-account", request.url);
//         url.searchParams.set("redirect", request.nextUrl.pathname); // Store the original path as 'redirect'
//         return NextResponse.redirect(url);
//     }



//     if (token && isAuth) {
//         // Check if the `redirect` query parameter is present
//         const redirectUrl = request.nextUrl.searchParams.get("redirect");

//         // Redirect to the specified path if `redirect` is available, otherwise go to `/my-account`
//         const destination = redirectUrl ? redirectUrl : "/my-account";

//         return NextResponse.redirect(new URL(destination, request.url));
//     }

//     if (!token && isAdmin) {
//         const url = new URL("/my-account", request.url);
//         url.searchParams.set("redirect", request.nextUrl.pathname); // Store the original path as 'redirect'
//         return NextResponse.redirect(url);
//     }

//     if (isAdmin) {
//         const decodedToken = jwtDecode(token);
//         role = decodedToken.role;
//         if (!token || role !== 'admin') {
//             return NextResponse.redirect(new URL('/my-account', request.url)) // Redirect to a "403 Forbidden" page or login
//         }
//     }

//     return NextResponse.next(); // Allow access if conditions are met
// }

// export const config = {
//     matcher: [
//         "/my-account/:path*",
//         "/checkout/:path*",],
// };


"use server";
import { jwtDecode } from "jwt-decode";
import { NextResponse, NextRequest } from "next/server";
import { UserData } from "./lib/types";

const protectedPaths = [
    /\/my-account(?!\/(lost-password|change-password))(.*)/, // Protect all except the specified exclusions
    /\/checkout\/(.*)/,
];

const auth = [
    "/my-account/lost-password",
    "/my-account/change-password",
];

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    const isProtected = protectedPaths.some((path) => path.test(request.nextUrl.pathname));
    const isAuth = auth.includes(request.nextUrl.pathname);
    const isAdmin = request.nextUrl.pathname.startsWith("/admin");

    if (request.nextUrl.pathname === "/my-account") {
        return NextResponse.next();
    }

    // Redirect to "/my-account" for protected paths if no token
    if (!token && isProtected) {
        const url = new URL("/my-account", request.url);
        url.searchParams.set("redirect", request.nextUrl.pathname); // Store the original path as 'redirect'
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users from auth pages to their intended destination or "/my-account"
    if (token && isAuth) {
        const redirectUrl = request.nextUrl.searchParams.get("redirect");
        const destination = redirectUrl ? redirectUrl : "/my-account";
        return NextResponse.redirect(new URL(destination, request.url));
    }

    // Redirect to "/my-account" for admin paths if no token
    if (!token && isAdmin) {
        const url = new URL("/my-account", request.url);
        url.searchParams.set("redirect", request.nextUrl.pathname); // Store the original path as 'redirect'
        return NextResponse.redirect(url);
        // return NextResponse.redirect(new URL("/my-account", request.url));
    }

    // Verify admin access for admin paths
    if (isAdmin) {
        try {
            const decodedToken = token ? jwtDecode<UserData>(token) : undefined;

            if (decodedToken && decodedToken.role !== "admin") {
                return NextResponse.redirect(new URL("/my-account", request.url));
            }
        } catch (error) {
            // Handle invalid token decoding
            console.error("Invalid token decoding:", error);
            return NextResponse.redirect(new URL("/my-account", request.url));
        }
    }


    return NextResponse.next(); // Allow access if conditions are met
}

export const config = {
    matcher: [
        "/my-account/:path*",
        "/checkout/:path*",
        "/admin/:path*",
    ],
};
