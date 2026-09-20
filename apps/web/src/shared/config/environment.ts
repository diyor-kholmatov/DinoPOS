const normalizedBaseUrl = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export const environment = Object.freeze({
  baseUrl: import.meta.env.BASE_URL,
  routerBasename: normalizedBaseUrl,
  production: import.meta.env.PROD,
});

