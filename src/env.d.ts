/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    user: import("better-auth").User | null;
    session: import("better-auth").Session | null;
  }
}

declare global {
  namespace Astro {
    interface Locals {
      user: import("better-auth").User & { role: string } | null;
      session: import("better-auth").Session | null;
    }
  }
}