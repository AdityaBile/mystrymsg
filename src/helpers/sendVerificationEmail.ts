//NOTE - Send email
import { resend } from "@/lib/resend"; //NOTE - resend.ts : resend email api key
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationemail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev", // our domain
      to: email, // To user
      subject: "Mystry message | Verification code",
      react: VerificationEmail({ username, otp: verifyCode }), //NOTE - email html template
    });
    return { success: true, message: "Verification email send successfully" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return {
      success: false,
      message: "Failde to send verification email",
    };
  }
}
