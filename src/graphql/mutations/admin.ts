import { gql } from "@apollo/client";

export const FLAG_USER = gql`
  mutation FlagUser($id: ID!, $reason: FlagUserReasonEnum!, $notes: String) {
    flagUser(id: $id, reason: $reason, notes: $notes) {
      success
      message
    }
  }
`;

export const ADMIN_MARK_ORDER_DELIVERED = gql`
  mutation AdminMarkOrderDelivered($orderId: Int!) {
    adminMarkOrderDelivered(orderId: $orderId) {
      success
      message
    }
  }
`;

export const ADMIN_RESOLVE_ORDER_ISSUE = gql`
  mutation AdminResolveOrderIssue(
    $issueId: Int!
    $status: String!
    $resolution: String
  ) {
    adminResolveOrderIssue(issueId: $issueId, status: $status, resolution: $resolution) {
      success
      message
    }
  }
`;

export const FLAG_PRODUCT = gql`
  mutation FlagProduct(
    $id: ID!
    $reason: ProductFlagReasonEnum!
    $flagType: ProductFlagTypeEnum!
    $notes: String
  ) {
    flagProduct(id: $id, reason: $reason, flagType: $flagType, notes: $notes) {
      success
      message
    }
  }
`;
