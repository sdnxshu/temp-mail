import { NAMES } from "@/constants/names";

const DOMAINS = [
    "hushed-sturgeon.resend.app"
]

export function generateEmail() {
    const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
    const randomDomain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    return `${randomName}@${randomDomain}`;
}
