import TestData from "../data/test-date.ts";

const makeAppTestData = TestData.makeAppointmentTestData();

// node debug/play.ts
for (const appData of makeAppTestData) {
    console.log(`Test data: ${JSON.stringify(appData)}`);
}
