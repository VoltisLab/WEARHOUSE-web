import { gql } from "@apollo/client";

export const NOTIFICATIONS_LIST = gql`
  query NotificationsList($pageCount: Int, $pageNumber: Int) {
    notifications(pageCount: $pageCount, pageNumber: $pageNumber) {
      id
      message
      model
      modelId
      modelGroup
      isRead
      createdAt
      meta
      sender {
        username
        thumbnailUrl
        profilePictureUrl
      }
    }
    notificationsTotalNumber
  }
`;

export const NOTIFICATION_PREFERENCE = gql`
  query NotificationPreference {
    notificationPreference {
      isPushNotification
      isEmailNotification
      inappNotifications
      emailNotifications
    }
  }
`;
