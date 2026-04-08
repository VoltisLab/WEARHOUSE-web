import { gql } from "@apollo/client";

/** Toggle like/unlike for the current user (requires consumer JWT). */
export const LIKE_PRODUCT = gql`
  mutation LikeProduct($productId: Int!) {
    likeProduct(productId: $productId) {
      success
    }
  }
`;

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

export const CREATE_OFFER = gql`
  mutation CreateOffer(
    $productIds: [Int]!
    $offerPrice: Float!
    $message: String
  ) {
    createOffer(
      productIds: $productIds
      offerPrice: $offerPrice
      message: $message
    ) {
      success
      message
      data {
        conversationId
      }
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder(
    $productId: Int
    $productIds: [Int]
    $shippingFee: Float
    $buyerProtection: Boolean
    $sellerShippingFees: [SellerShippingFeeInput!]
    $deliveryDetails: DeliveryDetailsInputType!
  ) {
    createOrder(
      productId: $productId
      productIds: $productIds
      shippingFee: $shippingFee
      buyerProtection: $buyerProtection
      sellerShippingFees: $sellerShippingFees
      deliveryDetails: $deliveryDetails
    ) {
      success
      order {
        id
        publicId
        status
        priceTotal
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
