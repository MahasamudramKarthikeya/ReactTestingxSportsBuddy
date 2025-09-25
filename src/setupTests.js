// src/setupTests.js
import "@testing-library/jest-dom";

// Polyfill for TextEncoder/TextDecoder in Node.js
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
