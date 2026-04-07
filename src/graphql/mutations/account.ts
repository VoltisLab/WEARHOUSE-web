import { gql } from "@apollo/client";

export const FOLLOW_USER = gql`
  mutation FollowUser($followedId: Int!) {
    followUser(followedId: $followedId) {
      success
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($followedId: Int!) {
    unfollowUser(followedId: $followedId) {
      success
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($isVacationMode: Boolean, $bio: String, $displayName: String) {
    updateProfile(
      isVacationMode: $isVacationMode
      bio: $bio
      displayName: $displayName
    ) {
      message
      user {
        id
        username
        isVacationMode
        bio
        displayName
      }
    }
  }
`;

export const CREATE_MULTIBUY_DISCOUNT = gql`
  mutation CreateMultibuyDiscount($inputs: [MultibuyInputType]!) {
    createMultibuyDiscount(inputs: $inputs) {
      multibuyDiscounts {
        id
        minItems
        discountValue
        isActive
      }
    }
  }
`;

export const DEACTIVATE_MULTIBUY_DISCOUNTS = gql`
  mutation DeactivateMultibuyDiscounts {
    deactivateMultibuyDiscounts {
      success
    }
  }
`;

export const UPDATE_NOTIFICATION_PREFERENCE = gql`
  mutation UpdateNotificationPreference(
    $isPushNotification: Boolean!
    $isEmailNotification: Boolean!
    $isSilentModeOn: Boolean!
  ) {
    updateNotificationPreference(
      isPushNotification: $isPushNotification
      isEmailNotification: $isEmailNotification
      isSilentModeOn: $isSilentModeOn
    ) {
      success
      notificationPreference {
        isPushNotification
        isEmailNotification
        inappNotifications
        emailNotifications
      }
    }
  }
`;

export const READ_NOTIFICATIONS = gql`
  mutation ReadNotifications($notificationIds: [Int]) {
    readNotifications(notificationIds: $notificationIds) {
      success
    }
  }
`;

export const REPORT_ACCOUNT = gql`
  mutation ReportAccount($username: String!, $reason: String!, $content: String) {
    reportAccount(username: $username, reason: $reason, content: $content) {
      success
      message
    }
  }
`;

export const REPORT_PRODUCT = gql`
  mutation ReportProduct($productId: ID!, $reason: String!, $content: String) {
    reportProduct(productId: $productId, reason: $reason, content: $content) {
      message
    }
  }
`;
