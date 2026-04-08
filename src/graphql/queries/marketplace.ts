import { gql } from "@apollo/client";

export const MARKETPLACE_CATEGORIES = gql`
  query MarketplaceCategories($parentId: Int) {
    categories(parentId: $parentId) {
      id
      name
      hasChildren
      fullPath
    }
  }
`;

/** Sizes for sell flow - same as Swift `ProductService.fetchSizes` / Flutter `sizes(path)`. */
export const MARKETPLACE_SIZES = gql`
  query MarketplaceSizes($path: String!) {
    sizes(path: $path) {
      id
      name
    }
  }
`;

export const MARKETPLACE_FEED = gql`
  query MarketplaceFeed(
    $pageCount: Int!
    $pageNumber: Int!
    $filters: ProductFiltersInput
    $search: String
    $sort: SortEnum
  ) {
    allProducts(
      pageCount: $pageCount
      pageNumber: $pageNumber
      filters: $filters
      search: $search
      sort: $sort
    ) {
      id
      name
      listingCode
      status
      price
      discountPrice
      condition
      imagesUrl
      likes
      userLiked
      isFeatured
      seller {
        id
        username
        displayName
        thumbnailUrl
      }
      brand {
        id
        name
      }
      category {
        id
        name
      }
    }
  }
`;

/** Logged-in only - same catalogue fields as `MARKETPLACE_FEED`. */
export const RECENTLY_VIEWED_PRODUCTS = gql`
  query RecentlyViewedProducts {
    recentlyViewedProducts {
      id
      name
      listingCode
      status
      price
      discountPrice
      condition
      imagesUrl
      likes
      userLiked
      isFeatured
      seller {
        id
        username
        displayName
        thumbnailUrl
      }
      brand {
        id
        name
      }
      category {
        id
        name
      }
    }
  }
`;

/** Logged-in buyer favourites (`@login_required`). */
export const LIKED_PRODUCTS = gql`
  query LikedProducts($pageCount: Int!, $pageNumber: Int!) {
    likedProducts(pageCount: $pageCount, pageNumber: $pageNumber) {
      product {
        id
        name
        listingCode
        status
        price
        discountPrice
        condition
        imagesUrl
        likes
        userLiked
        isFeatured
        seller {
          id
          username
          displayName
          thumbnailUrl
        }
        brand {
          id
          name
        }
        category {
          id
          name
        }
      }
    }
  }
`;

export const RECOMMENDED_SELLERS = gql`
  query RecommendedSellers($pageCount: Int!, $pageNumber: Int!) {
    recommendedSellers(pageCount: $pageCount, pageNumber: $pageNumber) {
      seller {
        username
        displayName
        thumbnailUrl
        profilePictureUrl
      }
    }
  }
`;

export const POPULAR_BRANDS = gql`
  query PopularBrands($top: Int!) {
    popularBrands(top: $top) {
      id
      name
    }
  }
`;

/** Buyer/seller order history for the logged-in user (`@login_required`). */
export const USER_ORDERS = gql`
  query UserOrders($pageCount: Int!, $pageNumber: Int!) {
    userOrders(pageCount: $pageCount, pageNumber: $pageNumber) {
      id
      publicId
      status
      createdAt
      updatedAt
      priceTotal
      user {
        username
      }
      seller {
        username
        displayName
      }
      lineItems {
        productName
        priceAtPurchase
        productImagesUrl
      }
    }
    userOrdersTotalNumber
  }
`;

export const MARKETPLACE_PRODUCT = gql`
  query MarketplaceProduct($id: Int!) {
    product(id: $id) {
      id
      name
      description
      status
      price
      discountPrice
      listingCode
      condition
      style
      imagesUrl
      likes
      userLiked
      category {
        id
        name
      }
      size {
        id
        name
      }
      brand {
        id
        name
      }
      seller {
        id
        username
        displayName
        thumbnailUrl
        isVerified
      }
    }
  }
`;

/** Authenticated buyer/seller order detail (`userOrder` query). */
export const USER_ORDER = gql`
  query UserOrder($orderId: Int!) {
    userOrder(orderId: $orderId) {
      id
      publicId
      status
      createdAt
      updatedAt
      priceTotal
      discountPrice
      buyerProtectionFee
      shippingFee
      itemsSubtotal
      shippingAddressJson
      orderConversationId
      trackingNumber
      trackingUrl
      carrierName
      user {
        username
        displayName
      }
      seller {
        username
        displayName
      }
      lineItems {
        id
        productId
        productName
        priceAtPurchase
        productImagesUrl
      }
      statusTimeline {
        id
        status
        createdAt
      }
      payments {
        id
        paymentRef
        paymentStatus
        paymentAmount
      }
    }
  }
`;

export const SEARCH_USERS = gql`
  query SearchUsers($search: String!) {
    searchUsers(search: $search) {
      id
      username
      displayName
      thumbnailUrl
      profilePictureUrl
      isVerified
    }
  }
`;

export const USER_MULTIBUY_DISCOUNTS = gql`
  query UserMultibuyDiscounts($userId: Int) {
    userMultibuyDiscounts(userId: $userId) {
      id
      minItems
      discountValue
      isActive
    }
  }
`;
