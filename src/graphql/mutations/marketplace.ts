import { gql } from "@apollo/client";

export const CREATE_CHAT = gql`
  mutation CreateChat($recipient: String!) {
    createChat(recipient: $recipient) {
      chat {
        id
        isOrder
        isOffer
        isSystemConversation
        recipient {
          username
          displayName
          thumbnailUrl
        }
      }
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $description: String!
    $price: Float!
    $category: Int!
    $size: Int
    $imagesUrl: [ImagesInputType!]!
    $condition: ConditionEnum
    $style: StyleEnum
    $status: ProductStatusEnum
  ) {
    createProduct(
      name: $name
      description: $description
      price: $price
      category: $category
      size: $size
      imagesUrl: $imagesUrl
      condition: $condition
      style: $style
      status: $status
    ) {
      success
      message
      product {
        id
        name
        listingCode
        status
        price
      }
    }
  }
`;
