import { expect, Page } from "@playwright/test";
import BasePage from "./base-page";
import { LOG } from "../helpers/logger";

export default class LoginPage extends BasePage {
    
    constructor(page: Page) {
        super(page);
    }

    get usernameInput() { return this.page.getByLabel("Username")}
    get passwordInput() { return this.page.getByLabel("Password")}
    get loginButton() { return this.page.getByRole("button", { name: "Login" })}
    get makeAppointmentLink() { return this.page.getByRole("link", { name: "Make Appointment" })}


    async login(url: string, username: string, password: string) {
        await this.navigateTo(url);
        await LOG("info", `Logging in with username: ${username}`);

        //workarround
        await this.navigateToMakeAppointment();
        await this.fill(this.usernameInput, username);
        await this.fill(this.passwordInput, password);
        await this.click(this.loginButton);

        await expect(this.page).toHaveURL(`${this.page.url()}`);
        await LOG("info", "Login successful");
    }

    async navigateToMakeAppointment() {
        await LOG("info", "Navigating to Make Appointment page");
        await this.click(this.makeAppointmentLink);
        await LOG("info", "Navigation to Make Appointment page successful");
    }

}