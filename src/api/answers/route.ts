/* eslint-disable @typescript-eslint/no-explicit-any */
import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { ID } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";
import { UserPrefs } from "@/Store/Auth";

export async function POST(request: NextRequest) {
  try {
    const { questionId, authorId, answer } = await request.json();

    //TODO: validate the input data for questionId, authorId and answer -- Malicious symbols, empty strings, length etc.

    const response = await databases.createDocument(
      db,
      answerCollection,
      ID.unique(),
      {
        questionId: questionId,
        authorId: authorId,
        content: answer,
      },
    );

    //Increase user's reputation by 1 point for providing an answer

    const prefs = await users.getPrefs<UserPrefs>(authorId);
    const currentReputation = Number(prefs?.reputation) || 0;
    await users.updatePrefs(authorId, {
      reputation: currentReputation + 1,
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Something went wrong while creating answer" },
      { status: error.status || error.code || 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { answerId, authorId } = await request.json();

    const answer = await databases.getDocument(db, answerCollection, answerId);

    if (answer && answer.authorId === authorId) {
      await databases.deleteDocument(db, answerCollection, answerId);
    }

    //Decrease user's reputation by 1 point for deleting an answer
    const prefs = await users.getPrefs<UserPrefs>(answer.authorId);
    const currentReputation = Number(prefs?.reputation) || 0;
    await users.updatePrefs(answer.authorId, {
      reputation: Math.max(currentReputation - 1, 0), // Ensure reputation doesn't go negative
    });

    return NextResponse.json(
      { message: "Answer deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Something went wrong while deleting answer",
      },
      { status: error.status || error.code || 500 },
    );
  }
}
