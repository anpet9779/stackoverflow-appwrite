import { IndexType, OrderBy, Permission } from "node-appwrite";
import { db, questionCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
  await databases.createCollection(
    db,
    questionCollection,
    "questionCollection",
    [
      Permission.read("any"),
      Permission.read("users"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ],
  );

  console.log("Question collection created");

  // Create attributes sequentially otherwise attributes will not be available for indexes
  await databases.createStringAttribute(
    db,
    questionCollection,
    "title",
    255,
    true,
  );
  await databases.createStringAttribute(
    db,
    questionCollection,
    "content",
    10000,
    true,
  );
  await databases.createStringAttribute(
    db,
    questionCollection,
    "authorId",
    50,
    true,
  );
  await databases.createStringAttribute(
    db,
    questionCollection,
    "tags",
    50,
    true,
    undefined,
    true,
  );
  await databases.createStringAttribute(
    db,
    questionCollection,
    "attachmentId",
    50,
    false,
  );

  console.log("Attributes requested");

  // Wait for critical attributes
  await waitForAttribute("title");
  await waitForAttribute("content");
  await waitForAttribute("authorId");

  console.log("Attributes are ready");

  // Now safe to create indexes
  await databases.createIndex(
    db,
    questionCollection,
    "title",
    IndexType.Fulltext,
    ["title"],
    [OrderBy.Asc],
  );

  await databases.createIndex(
    db,
    questionCollection,
    "content",
    IndexType.Fulltext,
    ["content"],
  );

  await databases.createIndex(
    db,
    questionCollection,
    "authorId",
    IndexType.Key,
    ["authorId"],
  );

  console.log("Indexes created");
}

async function waitForAttribute(key: string) {
  while (true) {
    const res = await databases.listAttributes(db, questionCollection);
    const attr = res.attributes.find((a) => a.key === key);

    if (attr && attr.status === "available") break;

    await new Promise((r) => setTimeout(r, 500));
  }
}
