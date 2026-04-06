import { gql } from "@apollo/client";

/** Logged-in user inbox (same as consumer app). */
export const CONVERSATIONS_INBOX = gql`
  query ConversationsInbox {
    conversations {
      id
      lastModified
      isOrder
      isOffer
      isSystemConversation
      unreadMessagesCount
      recipient {
        username
        displayName
        thumbnailUrl
      }
      lastMessage {
        id
        text
        createdAt
        sender {
          username
        }
      }
    }
  }
`;

export const CONVERSATION_BY_ID = gql`
  query ConversationById($id: ID!) {
    conversationById(id: $id) {
      id
      isOrder
      isOffer
      isSystemConversation
      recipient {
        username
        displayName
        thumbnailUrl
      }
      order {
        id
        publicId
        user {
          username
          thumbnailUrl
        }
        seller {
          username
          thumbnailUrl
        }
      }
      offerHistory {
        id
        offerPrice
        status
        message
        createdAt
        buyer {
          username
        }
        products {
          id
          name
          listingCode
          price
          imagesUrl
        }
      }
    }
  }
`;
