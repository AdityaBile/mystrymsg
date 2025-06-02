//NOTE - Api to send email msg
import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMesssage?: boolean;
  messages?: Array<Message>;
}
