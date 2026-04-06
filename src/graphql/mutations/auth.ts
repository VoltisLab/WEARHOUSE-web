import { gql } from "@apollo/client";

/** Consumer login — kept for compatibility. */
export const LOGIN = gql`
  mutation Login($password: String!, $username: String) {
    login(password: $password, username: $username) {
      token
      refreshToken
      user {
        id
        username
      }
    }
  }
`;

/** Staff login — matches consumer `adminLogin` API. */
export const ADMIN_LOGIN = gql`
  mutation AdminLogin($username: String!, $password: String!) {
    adminLogin(username: $username, password: $password) {
      success
      token
      refreshToken
      user {
        id
        username
        email
      }
    }
  }
`;
