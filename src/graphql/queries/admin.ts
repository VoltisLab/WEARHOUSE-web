import { gql } from "@apollo/client";

export const VIEW_ME = gql`
  query ViewMe {
    viewMe {
      id
      username
      email
      firstName
      lastName
      displayName
      bio
      isVerified
      isVacationMode
      listing
      dateJoined
      lastLogin
      lastSeen
      thumbnailUrl
      profilePictureUrl
      noOfFollowers
      noOfFollowing
      credit
      userType
      isStaff
      isSuperuser
      location {
        locationName
      }
      reviewStats {
        noOfReviews
        rating
      }
    }
  }
`;

export const ANALYTICS_OVERVIEW = gql`
  query AnalyticsOverview {
    analyticsOverview {
      totalProductViews
      totalProductViewsToday
      totalUsers
      totalNewUsersToday
      totalUsersPercentageChange
      totalProductViewsPercentageChange
      totalProductViewsBeforeTodayPercentage
      newUsersPercentageChange
    }
  }
`;

export const USER_ADMIN_STATS = gql`
  query UserAdminStats($search: String, $pageCount: Int, $pageNumber: Int) {
    userAdminStats(search: $search, pageCount: $pageCount, pageNumber: $pageNumber) {
      id
      username
      email
      displayName
      firstName
      lastName
      isVerified
      isStaff
      isSuperuser
      activeListings
      totalListings
      totalSales
      totalShopValue
      thumbnailUrl
      profilePictureUrl
      dateJoined
      lastLogin
      lastSeen
      noOfFollowers
      noOfFollowing
      credit
    }
  }
`;

export const ADMIN_ALL_ORDERS = gql`
  query AdminAllOrders($pageCount: Int, $pageNumber: Int) {
    adminAllOrders(pageCount: $pageCount, pageNumber: $pageNumber) {
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
      }
      lineItems {
        id
        productId
        productName
        productImagesUrl
        priceAtPurchase
      }
    }
    adminAllOrdersTotalNumber
  }
`;

export const ALL_ORDER_ISSUES = gql`
  query AllOrderIssues {
    allOrderIssues {
      id
      publicId
      issueType
      description
      otherIssueDescription
      imagesUrl
      status
      resolution
      resolvedAt
      createdAt
      updatedAt
      supportConversationId
      sellerSupportConversationId
      raisedBy {
        username
      }
      resolvedBy {
        username
      }
      order {
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
        shippingLabelUrl
        user {
          username
        }
        seller {
          username
        }
        offer {
          id
          status
        }
        cancelledOrder {
          buyerCancellationReason
          sellerResponse
          status
          notes
        }
        lineItems {
          id
          productId
          productName
          priceAtPurchase
          productImagesUrl
        }
        payments {
          id
          paymentRef
          paymentStatus
          paymentAmount
          paymentMethod
          createdAt
        }
        refunds {
          id
          refundAmount
          status
          reason
        }
        statusTimeline {
          id
          status
          createdAt
        }
      }
    }
  }
`;

export const ALL_REPORTS = gql`
  query AllReports {
    allReports {
      id
      publicId
      reportType
      reason
      context
      imagesUrl
      status
      dateCreated
      updatedAt
      reportedByUsername
      accountReportedUsername
      productId
      productName
      conversationId
      supportConversationId
      orderId
      sellerSupportConversationId
    }
  }
`;

export const BANNERS = gql`
  query Banners {
    banners {
      id
      title
      season
      isActive
      bannerUrl
      createdAt
      updatedAt
      createdBy {
        username
        displayName
      }
      updatedBy {
        username
        displayName
      }
    }
  }
`;

export const ALL_PRODUCTS = gql`
  query AllProducts($pageCount: Int!, $pageNumber: Int!, $filters: ProductFiltersInput) {
    allProducts(pageCount: $pageCount, pageNumber: $pageNumber, filters: $filters) {
      id
      name
      listingCode
      status
      price
      imagesUrl
      seller {
        username
      }
    }
  }
`;

export const CONVERSATION_MESSAGES = gql`
  query ConversationMessages($id: ID!, $pageCount: Int, $pageNumber: Int) {
    conversation(id: $id, pageCount: $pageCount, pageNumber: $pageNumber) {
      id
      text
      createdAt
      imageUrls
      attachment
      attachmentType
      isItem
      itemId
      itemType
      sender {
        username
        thumbnailUrl
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($username: String!) {
    getUser(username: $username) {
      id
      username
      email
      firstName
      lastName
      displayName
      bio
      isVerified
      isVacationMode
      listing
      dateJoined
      lastLogin
      lastSeen
      thumbnailUrl
      profilePictureUrl
      noOfFollowers
      noOfFollowing
      credit
      isStaff
      isSuperuser
      location {
        locationName
        latitude
        longitude
      }
      reviewStats {
        noOfReviews
        rating
      }
    }
  }
`;

export const USER_SHOP_PRODUCTS = gql`
  query UserShopProducts(
    $username: String!
    $pageCount: Int!
    $pageNumber: Int!
    $filters: ProductFiltersInput
    $search: String
  ) {
    userProducts(
      username: $username
      pageCount: $pageCount
      pageNumber: $pageNumber
      filters: $filters
      search: $search
    ) {
      id
      name
      listingCode
      status
      price
      imagesUrl
      seller {
        username
      }
      category {
        id
        name
      }
    }
  }
`;

export const STAFF_PRODUCT = gql`
  query StaffProduct($id: Int!) {
    product(id: $id) {
      id
      name
      description
      status
      price
      discountPrice
      listingCode
      views
      likes
      userLiked
      isFeatured
      condition
      style
      styles
      parcelSize
      color
      customBrand
      hashtags
      createdAt
      updatedAt
      imagesUrl
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
      materials {
        id
        name
      }
      seller {
        id
        username
        displayName
        profilePictureUrl
        thumbnailUrl
        isVerified
        reviewStats {
          noOfReviews
          rating
        }
      }
    }
  }
`;

export const ADMIN_ORDER_DETAIL = gql`
  query AdminOrderDetail($orderId: Int!) {
    adminOrder(orderId: $orderId) {
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
      shippingLabelUrl
      user {
        username
      }
      seller {
        username
      }
      lineItems {
        id
        productId
        productName
        priceAtPurchase
        productImagesUrl
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
