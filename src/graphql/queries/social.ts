import { gql } from "@apollo/client";

export const USER_FOLLOWERS = gql`
  query UserFollowers(
    $username: String
    $search: String
    $pageCount: Int
    $pageNumber: Int
  ) {
    followers(
      username: $username
      search: $search
      pageCount: $pageCount
      pageNumber: $pageNumber
    ) {
      id
      username
      displayName
      thumbnailUrl
      profilePictureUrl
      isVerified
    }
    followersTotalNumber
  }
`;

export const USER_FOLLOWING = gql`
  query UserFollowing(
    $username: String
    $search: String
    $pageCount: Int
    $pageNumber: Int
  ) {
    following(
      username: $username
      search: $search
      pageCount: $pageCount
      pageNumber: $pageNumber
    ) {
      id
      username
      displayName
      thumbnailUrl
      profilePictureUrl
      isVerified
    }
    followingTotalNumber
  }
`;

export const USER_REVIEWS = gql`
  query UserReviews(
    $username: String!
    $pageCount: Int
    $pageNumber: Int
  ) {
    userReviews(username: $username, pageCount: $pageCount, pageNumber: $pageNumber) {
      id
      rating
      comment
      isAutoReview
      dateCreated
      reviewer {
        username
        displayName
        thumbnailUrl
      }
    }
    userReviewsTotalNumber
  }
`;
