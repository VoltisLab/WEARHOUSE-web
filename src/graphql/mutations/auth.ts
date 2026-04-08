import { gql } from "@apollo/client";

/** Consumer login - kept for compatibility. */
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

/** Consumer registration - `NewRegister` / graphql-auth fields from backend settings. */
export const REGISTER = gql`
  mutation Register(
    $email: String!
    $username: String!
    $first_name: String!
    $last_name: String!
    $password1: String!
    $password2: String!
    $user_type: String
  ) {
    register(
      email: $email
      username: $username
      first_name: $first_name
      last_name: $last_name
      password1: $password1
      password2: $password2
      user_type: $user_type
    ) {
      success
      errors
      token
      refreshToken
      user {
        id
        username
      }
    }
  }
`;

/** Staff login - matches consumer `adminLogin` API. */
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

/** Request password reset email (unauthenticated). */
export const RESET_PASSWORD_REQUEST = gql`
  mutation ResetPasswordRequest($email: String) {
    resetPassword(email: $email) {
      message
    }
  }
`;

/** Complete reset with code from email (unauthenticated). */
export const PASSWORD_RESET_COMPLETE = gql`
  mutation PasswordResetComplete(
    $email: String!
    $code: String!
    $password: String!
  ) {
    passwordReset(email: $email, code: $code, password: $password) {
      message
      token
      restToken
      user {
        id
        username
      }
    }
  }
`;
