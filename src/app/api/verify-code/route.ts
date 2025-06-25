//NOTE - Verify user using code send from resend email

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodeUsername = decodeURIComponent(username); //NOTE - converts encoded url to unencoded

    const user = await UserModel.findOne({ username: decodeUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verfiyCode === code; // Boolean check
    // expiry date(time) should be greater than current time
    const isCodeNotExpired = new Date(user.verfiyCodeExpiry) > new Date();

    //NOTE - User enter correct otp(code)
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      //NOTE - code expires
      return Response.json(
        {
          success: false,
          message:
            "Verification code has been expired, please signup again to get new code",
        },
        { status: 400 }
      );
    } else {
      //NOTE - User enter wrong code
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error verifying user ", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
