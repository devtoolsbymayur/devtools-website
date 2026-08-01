import { describe, expect, it } from "vitest";
import { parseAdUnitCode, shouldServeRealAds } from "@/lib/ads";

describe("parseAdUnitCode", () => {
  it("extracts client and slot from a typical AdSense snippet", () => {
    const html = `
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossorigin="anonymous"></script>
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-1234567890123456"
           data-ad-slot="9876543210"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    `;
    expect(parseAdUnitCode(html)).toEqual({
      client: "ca-pub-1234567890123456",
      slot: "9876543210",
      format: "auto",
      fullWidthResponsive: "true",
      style: "display:block",
    });
  });

  it("returns null when required attributes are missing", () => {
    expect(parseAdUnitCode("<div>ad</div>")).toBeNull();
    expect(parseAdUnitCode("")).toBeNull();
  });
});

describe("shouldServeRealAds", () => {
  it("is false outside production", () => {
    expect(shouldServeRealAds()).toBe(false);
  });
});
