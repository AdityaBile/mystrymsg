import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  //NOTE - From url
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // if user is not accepting messages
    if (!user.isAcceptMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    // create new messgae
    const newMessage = { content, createdAt: new Date() }; // Message object
    user.messages.push(newMessage as Message); // messages array on UserModel object
    await user.save();

    return Response.json(
      {
        success: true,
        message: "message sent successfully",
      },
      { status: 401 }
    );
  } catch (error) {
    console.log("Error in adding message: ", error);
    return Response.json(
      {
        success: false,
        message: "Interal server error",
      },
      { status: 500 }
    );
  }
}
