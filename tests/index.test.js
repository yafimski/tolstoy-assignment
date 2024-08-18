import { describe, it, expect } from "vitest";

describe("POST /fetch-metadata", () => {
  it("should return metadata for valid URLs", async () => {
    const response = await fetch("/fetch-metadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urls: ["https://www.wikipedia.org", "https://github.com"],
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
    expect(data[0]).toHaveProperty("title");
    expect(data[0]).toHaveProperty("description");
    expect(data[0]).toHaveProperty("image");
  });

  it("should return a 429 error when too many requests are made", async () => {
    const makeRequest = async () => {
      return fetch(`${serverUrl}/fetch-metadata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urls: ["https://www.wikipedia.org"],
        }),
      });
    };

    const requests = Array.from({ length: 6 }, () => makeRequest());
    const responses = await Promise.all(requests);

    const rateLimitedResponse = responses.find((res) => res.status === 429);
    expect(rateLimitedResponse).toBeDefined();
  });
});
