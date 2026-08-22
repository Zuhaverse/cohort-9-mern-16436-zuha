import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

jest.mock("react-quill-new");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;