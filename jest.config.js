// //  @type {import('ts-jest').JestConfigWithTsJest}
// module.exports = {
//   testEnvironment: "node",
//   transform: {
//     "^.+\\.tsx?$": "ts-jest",
//   },
// };
/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./__tests__/jest.setup.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest", // ✅ Ensure TypeScript is compiled
  },
  forceExit: true,
  detectOpenHandles: true,
};

