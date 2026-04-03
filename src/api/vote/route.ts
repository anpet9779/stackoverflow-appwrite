/* eslint-disable @typescript-eslint/no-explicit-any */
import { db, voteCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function POST(request: NextRequest) {
  try {
    //get request data

    const { votedById, voteStatus, type, typeId } = await request.json();

    // list documents in the votes collection
    const response = await databases.listDocuments(db, voteCollection, [
      Query.equal("votedById", votedById),
      Query.equal("type", type),
      Query.equal("typeId", typeId),
    ]);

    if (response.documents.length > 0) {
      // Handle case where vote already exists
    }

    // change the vote status if the user has already voted

    // that means prev vote doesn't exist or vote status changes

    if (response.documents[0]?.voteStatus === voteStatus) {
      //
    }

    /* Grab upvotes and downvotes */
    const [upVotes, downVotes] = await Promise.all([
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "upvoted"),
        Query.equal("votedById", votedById),
        Query.limit(1),
      ]),
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "downvoted"),
        Query.equal("votedById", votedById),
        Query.limit(1),
      ]),
    ]);

    return NextResponse.json(
      {
        data: {
          document: null,
          voteResult: (upVotes.total = downVotes.total),
        },
        message: "Vote updated successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Something went wrong while updating vote" },
      { status: error.status || error.code || 500 },
    );
  }
}
