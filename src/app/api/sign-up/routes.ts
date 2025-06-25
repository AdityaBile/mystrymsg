import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect(); // Connect to DB

  try {
    const { username, email, password } = await request.json(); // sign-up schema

    //SECTION - case1: Verified user
    const existingUserverifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserverifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 400,
        }
      );
    }

    //SECTION - case2: User by email
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    //SECTION - case2.1 User had registered with mail
    if (existingUserByEmail) {
      //SECTION - case2.1.1 User had registered with mail and verified
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this emal",
          },
          { status: 400 }
        );
      }
      //SECTION - case2.1.2 User had registered with mail and not verified => re-register user
      else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verfiyCode = verifyCode;
        existingUserByEmail.verfiyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      //SECTION - case3: New user -> register user!
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Password will expire after 1 hr

      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        verifyCode,
        verfiyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    //NOTE - ".success" is from resend mail api
    // if mail not send
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message, //NOTE - Error message
        },
        { status: 500 }
      );
    }

    // mail send successful
    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your mail",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error in registering user",
      },
      {
        status: 500,
      }
    );
  }
}
