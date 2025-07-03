import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

// To Toggle to accept messages
export async function GET(request: Request) {
  await dbConnect();
  // get current login user
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Autheticated",
      },
      { status: 401 }
    );
  }

  // When getting id from by findby query no issue
  // But here string conversion issue so use mongoose.Types
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    //Aggregation Pipeline : An aggregation pipeline consists of one or more stages that process documents.
    //e.g avg picking values from each stage
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      //unwind : Outputs a new document for each element in a specified array.
      { $unwind: "$messages" },
      { $sort: { "messags.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("An unexpected error had occured: ", error);
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 500 }
    );
  }
}
