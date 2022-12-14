import { faker } from "@faker-js/faker";
import { IUser } from "../../models/User";

export function generateUserData(overide = {}) {
  return {
    id: faker.random.numeric(),
    email: faker.internet.email(),
    password: faker.random.alphaNumeric(),
    ...overide,
  };
}

export function generateUserPayload() {
  return {
    email: faker.internet.email(),
    password: faker.random.alphaNumeric(),
  };
}

export function generatePostData() {
  const postData = {
    id: faker.random.numeric(),
    email: faker.internet.email(),
    password: faker.random.alphaNumeric(),
    avatar: faker.random.alphaNumeric(),
  };
  return postData;
}

export function generatePostPayload() {
  return {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    userId: faker.random.numeric(),
  };
}
