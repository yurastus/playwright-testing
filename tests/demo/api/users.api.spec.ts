import { test } from "../../helpers/config-fixture";
import { LOG } from "../../helpers/logger";



//TODO - move to .env
const API_KEY = "reqres_95b1e378c1974780a9a54876e7c4e950";

//TODO - move to config file
const BASE_URL = "https://reqres.in/api";


test.describe("API Tests for Users", () => {

    test("GET /users - should return a list of users", async ({ request }) => {
        await LOG("info", "Sending GET request to /users endpoint");

        //TODO - endpoint move to constants.json file
        const response = await request.get(`${BASE_URL}/users?page=2`, { 
            headers: { "x-api-key": API_KEY } 
        })
        test.expect(response.status()).toBe(200);
        await LOG("info", "GET request successful, status code: 200");

        const responseBody = await response.json();
        await LOG("info", `Response body: ${JSON.stringify(responseBody)}`);
    });

    test("POST /users - should create a new user", async ({ request }) => {
        await LOG("info", "Sending POST request to /users endpoint");
        
        //TODO - move test_data.json 
        const newUser = {
            name: "John Doe",
            job: "Software Developer"
        };

        const response = await request.post(`${BASE_URL}/users`, {
            headers: { "x-api-key": API_KEY },
            data: newUser
        });

        test.expect(response.status()).toBe(201);
        await LOG("info", "POST request successful, status code: 201");

        const responseBody = await response.json();
        await LOG("info", `Response body: ${JSON.stringify(responseBody)}`);
    });

});
