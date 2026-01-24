import { profaneFilter } from "../api/chirps.js";

type Test = { input: string, expected: string }
type Tests = Test[];
type FilteringFunction = (a: string) => string;

const tests: Tests = [
    {
        input: "I had something interesting for breakfast",
        expected: "I had something interesting for breakfast"
    },
    {
        input: "I hear Mastodon is better than Chirpy. sharbert I need to migrate",
        expected: "I hear Mastodon is better than Chirpy. **** I need to migrate"
    },
    {
        input: "I really need a kerfuffle to go to bed sooner, Fornax !",
        expected: "I really need a **** to go to bed sooner, **** !"
    }
];

//
export function runTests(testCases: Tests, fn: FilteringFunction): void {
    let numCorrect: number = 0;
    for (const testCase of testCases) {
        const { input, expected } = testCase;
        const actualResult = fn(input);
        console.log(`--------------------------------------------------`);
        if (actualResult === expected) {
            console.log(`Correct!`);
            numCorrect += 1;
        } else {
            console.log(`Incorrect:`);
            // console.log(`Input:      ${input}           | Length: ${input.length}           | Type: ${typeof input}`);
            // console.log(`Expected:   ${expected}        | Length: ${expected.length}        | Type: ${typeof expected}`);
            // console.log(`Actual:     ${actualResult}    | Length: ${actualResult.length}    | Type: ${typeof actualResult}`);
            // 
            console.log("Inp: %s | Length: %d | Type: %s", input, input.length, typeof input);
            console.log("Exp: %s | Length: %d | Type: %s", expected, expected.length, typeof expected);
            console.log("Act: %s | Length: %d | Type: %s", actualResult, actualResult.length, typeof actualResult);
        }
        console.log(`--------------------------------------------------`);
    }
    //
    const percentage = (numCorrect / testCases.length) * 100;
    console.log(`Pass Rate: ${numCorrect}/${testCases.length}`);
    console.log(`${percentage}%`);
    console.log(`----------------------------------------------------------------------------------------------------`);
}


runTests(tests, profaneFilter);
