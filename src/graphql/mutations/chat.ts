import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
  mutation SendMessage(
    $conversationId: Int!
    $message: String!
    $messageUuid: String
  ) {
    sendMessage(
      conversationId: $conversationId
      message: $message
      messageUuid: $messageUuid
    ) {
      success
      messageId
    }
  }
`;
