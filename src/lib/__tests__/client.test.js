import client, { createClient } from "../client";
import firebase from "../firebase";

jest.mock("../firebase");

let originalFetch = window.fetch;

beforeAll(() => {
  // replace fetch with a mock function that just returns a successful promise
  window.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ test: 1 }),
    })
  );

  // set a fake logged in user for the Firebase mock
  firebase._setMockState({
    loaded: true,
    user: { email: "blah", token: "fake123" },
  });
});

afterEach(() => {
  // reset mock state after each test
  // e.g. so fetch.mock.calls is back at 0
  window.fetch.mockClear();
});

afterAll(() => {
  // remove the mock so window.fetch is normal again
  jest.clearAllMocks();
  window.fetch = originalFetch;
});

const defaultHeaders = {
  authorization: "Bearer fake123",
  "content-type": "application/json",
};

test("client sets correct default headers, stringifies req body & parses res body", async () => {
  const result = await client("fake-url", {
    method: "POST",
    body: { test: 1 },
  });
  expect(window.fetch).toHaveBeenCalledTimes(1);
  expect(window.fetch).toHaveBeenCalledWith("fake-url", {
    headers: defaultHeaders,
    method: "POST",
    body: JSON.stringify({ test: 1 }),
  });
  expect(result).toEqual({ test: 1 });
});

test("client appends prefixUrl and headers to requests", async () => {
  const prefixedClient = createClient({
    prefixUrl: "https://my-api.com/",
    headers: { "x-test": "fake456" },
  });
  await prefixedClient("fake-url");
  expect(window.fetch).toHaveBeenCalledTimes(1);
  expect(window.fetch).toHaveBeenCalledWith("https://my-api.com/fake-url", {
    headers: { ...defaultHeaders, "x-test": "fake456" },
  });
});

test("user can override client defaults", async () => {
  const prefixedClient = createClient({
    prefixUrl: "https://my-api.com/",
    json: false,
    auth: false,
  });
  await prefixedClient("fake-url", {
    method: "POST",
    headers: { "content-type": "text/html" },
    body: "<h1>Hello</h1>",
  });
  expect(window.fetch).toHaveBeenCalledTimes(1);
  expect(window.fetch).toHaveBeenCalledWith("https://my-api.com/fake-url", {
    method: "POST",
    headers: { "content-type": "text/html" },
    body: "<h1>Hello</h1>",
  });
});

test("client handles bad responses", async () => {
  window.fetch.mockImplementationOnce(() =>
    Promise.resolve({ ok: false, status: 400, statusText: "Bad request" })
  );
  // check that client rejects with a matching error
  await client("fake-url").catch((error) => {
    expect(error.status).toBe(400);
    expect(error.message).toBe("400 Bad request");
  });
});

test("client does not try to parse 204 responses as JSON", async () => {
  window.fetch.mockImplementationOnce(() =>
    Promise.resolve({ ok: true, status: 204 })
  );
  const result = await client("fake-url");
  expect(result).toBe("");
});
