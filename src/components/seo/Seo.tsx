import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type SeoType = "website" | "article" | "profile";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: SeoType;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  keywords?: string;
}

const SITE_NAME = "Ragul S - Portfolio";
const DEFAULT_IMAGE = "/rscreationslogo.ico";

const getSiteUrl = () => {
  const configured = import.meta.env.VITE_SITE_URL as string | undefined;
  if (configured && configured.trim().length > 0) {
    return configured.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return "https://rscreationstech.com";
};

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
};

const upsertLink = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
};

export function Seo({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  jsonLd,
  keywords,
}: SeoProps) {
  const location = useLocation();

  useEffect(() => {
    const siteUrl = getSiteUrl();
    const pagePath = path ?? location.pathname;
    const canonicalUrl = `${siteUrl}${pagePath.startsWith("/") ? pagePath : `/${pagePath}`}`;
    const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image.startsWith("/") ? image : `/${image}`}`;

    document.title = `${title} | Ragul S - Full Stack Developer & Cybersecurity Enthusiast`;

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="author"]', { name: "author", content: "Ragul S" });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1",
    });

    if (keywords) {
      upsertMeta('meta[name="keywords"]', { name: "keywords", content: keywords });
    }

    upsertMeta('meta[property="og:title"]', { property: "og:title", content: `${title} | Ragul S` });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });

    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: `${title} | Ragul S` });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });

    upsertLink('link[rel="canonical"]', { rel: "canonical", href: canonicalUrl });

    document.head
      .querySelectorAll('script[data-seo-jsonld="true"]')
      .forEach((script) => script.parentNode?.removeChild(script));

    if (jsonLd) {
      const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      blocks.forEach((block) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-jsonld", "true");
        script.text = JSON.stringify(block);
        document.head.appendChild(script);
      });
    }
  }, [description, image, jsonLd, keywords, location.pathname, noindex, path, title, type]);

  return null;
}
