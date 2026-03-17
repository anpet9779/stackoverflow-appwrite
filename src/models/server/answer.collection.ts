import { IndexType, OrderBy, Permission } from "node-appwrite";
import { db, answerCollection } from "../name";
import { databases } from "./config";

export default async function createAnswerCollection() {
  await databases.createCollection(db, answerCollection, "answerCollection", [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);

  console.log("Answer collection created");

  //   Creating attributes and indexes
  await Promise.all([
    databases.createStringAttribute(
      db,
      answerCollection,
      "content",
      10000,
      true,
    ),
    databases.createStringAttribute(
      db,
      answerCollection,
      "questionId",
      50,
      true,
    ),
    databases.createStringAttribute(db, answerCollection, "authorId", 50, true),
  ]);

  console.log("Question attribute created");

  //Create indexes
  await Promise.all([
    databases.createIndex(
      db,
      answerCollection,
      "content",
      IndexType.Fulltext,
      ["content"],
      [OrderBy.Asc],
    ),
  ]);
}
