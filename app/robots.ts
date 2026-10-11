// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/transactions/", "/settings/"], // Hide private routes
    },
    sitemap: "https://curo.money/sitemap.xml",
  };
}
