import { Permission } from "node-appwrite";
import { db, commentCollection } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
  await databases.createCollection(db, commentCollection, "commentCollection", [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);

  console.log("Comment collection created");

  //   Creating attributes and indexes
  await Promise.all([
    databases.createEnumAttribute(
      db,
      commentCollection,
      "type",
      ["answer", "question"],
      true,
    ),
    databases.createStringAttribute(
      db,
      commentCollection,
      "content",
      10000,
      true,
    ),
    databases.createStringAttribute(db, commentCollection, "typeId", 50, true),
    databases.createStringAttribute(
      db,
      commentCollection,
      "authorId",
      50,
      true,
    ),
  ]);

  console.log("Comment attribute created");
}
