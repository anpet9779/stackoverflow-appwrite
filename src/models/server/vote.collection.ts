import { Permission } from "node-appwrite";
import { db, voteCollection } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
  await databases.createCollection(db, voteCollection, "voteCollection", [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);

  console.log("Vote collection created");

  //   Creating attributes and indexes
  await Promise.all([
    databases.createStringAttribute(db, voteCollection, "votedById", 50, true),
    databases.createStringAttribute(db, voteCollection, "typeId", 50, true),
    databases.createEnumAttribute(
      db,
      voteCollection,
      "type",
      ["question", "answer"],
      true,
    ),
    databases.createEnumAttribute(
      db,
      voteCollection,
      "voteStatus",
      ["upvoted", "downvoted"],
      true,
    ),
  ]);

  console.log("Comment attribute created");
}
