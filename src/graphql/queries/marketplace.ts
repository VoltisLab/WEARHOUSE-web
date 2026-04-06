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
      imagesUrl
      seller {
        username
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
