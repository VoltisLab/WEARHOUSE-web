# Swift app ↔ consumer web parity checklist

Single source of truth for feature parity between **MyPrelura (Swift)** and **`prelura-admin-web` marketplace routes** (`(marketplace)`). Check items off as they ship; add rows if new Swift screens appear.

**Legend:** `[x]` = implemented on web for buyers/sellers (not staff console). `[ ]` = gap or partial. **N/A** = staff-only, debug-only, or native-only (no web target).

**Last audited:** 2026-04-06 (Swift `Myprelura/Views/**`, web `src/app/(marketplace)/**`). Updated 2026-04-06 after web parity batch.

### Meta (process)

- [x] Maintain a single exhaustive checklist in-repo (`MARKETPLACE_SWIFT_PARITY.md`).
- [ ] Re-audit after major Swift or web releases (bump **Last audited** date).

---

## A. App shell & global behaviour

- [ ] Splash / branded launch — web: no equivalent first paint gate (N/A or low priority).
- [x] Logged-out gate → auth — web: `/login`, `/signup`; header links.
- [x] Logged-in main chrome — web: `MarketplaceShell` (header, bottom nav desktop/tablet pattern, footer).
- [x] Tab bar: Home — web: `/`, `MarketplaceShell` tab “Home”.
- [x] Tab bar: Discover — web: `/search` (+ product under `/product/[id]` counts as Discover stack).
- [x] Tab bar: Sell — web: `/sell`.
- [x] Tab bar: Inbox — web: `/messages`, `/messages/[conversationId]`.
- [x] Tab bar: Profile / “You” — web: tab label “You”; routes `/profile`, `/profile/[username]`, `/account` redirect, `/saved`, `/account/*`.
- [ ] Tap same tab to refresh (Swift `TabCoordinator`) — web: no refresh-on-reselect.
- [ ] Appearance: system / light / dark persisted (`kAppearanceMode`) — web: follows system/CSS only; no settings toggle.
- [ ] Deep links / universal links (`AppRouter`) — web: standard URLs only; parity with app link matrix not verified.
- [ ] Push notification open → thread (`pendingInboxChat`) — web: browser push not in parity scope (N/A or future).

---

## B. Authentication (`Views/Auth`)

- [x] Login — web: `/login` (`LOGIN` mutation).
- [x] Sign up — web: `/signup`.
- [x] Forgot password — web: `/forgot-password` (`resetPassword` mutation).
- [x] Email sent / reset flow — web: `/reset-password` (`passwordReset` mutation; optional `?email=&code=` query params).
- [ ] Email verification code — web: **missing** (`EmailVerificationCodeView`).
- [ ] Verify user (post-signup) — web: **missing** (`VerifyUserView`).
- [x] Log out — web: header control + auth context.

---

## C. Onboarding (`Views/Onboarding`)

- [ ] Onboarding carousel / flow — web: **missing** (`OnboardingView`, `OnboardingFlowView`).
- [ ] Try Cart onboarding — web: **missing** (`TryCartOnboardingView`).

---

## D. Home tab (`Views/Home`)

- [x] Home feed / landing — web: `(marketplace)/page.tsx` + home components (hero, rails — verify against Swift `HomeView`).

---

## E. Discover tab (`Views/Discover`)

- [x] Discover root (categories, banners, feed) — web: `DiscoverFeed` on `/search`; home `/` is a separate `MARKETPLACE_FEED` experience (Swift `HomeView` vs `DiscoverView` both covered).
- [ ] Lookbooks feed (full Swift `LookbookView` UX: carousel, author, interactions) — web: banner / placeholder only; **no** full lookbook feed page.
- [x] Search members — web: `/search/members` (`searchUsers` query; signed-in).
- [x] Open product from discover — web: `/product/[id]`.

---

## F. Filtered products & Try Cart / Shop All bag (`FilteredProducts`, shared bag)

- [ ] Filtered product grid (Swift `FilteredProductsView`) — web: search may partially cover; **explicit** filters parity not audited line-by-line.
- [ ] Shop All bag (`ShopAllBagView`, `ShopAllBagStore` multiselect checkout) — web: **missing**.
- [ ] Try Cart campaign UX — web: **missing** (ties to onboarding + bag).

---

## G. Sell tab (`Views/Sell`)

- [x] List item form — web: `/sell` (create product GraphQL).
- [ ] Full parity with Swift `SellView` fields (photos limit, categories, postage, condition, etc.) — **needs** field-by-field audit.
- [ ] Sell form drafts / resume — verify Swift vs web.

---

## H. Item detail (`Views/ItemDetail`)

- [x] PDP shell — web: `/product/[id]`.
- [x] Like / unlike (heart) with server sync — web: `ProductLikeButton` + `likeProduct` on PDP and product cards (`MARKETPLACE_PRODUCT` / feed `userLiked` + `likes`).
- [ ] Send offer sheet — web: **missing** (`SendOfferSheet`).
- [x] Report listing from PDP — web: `ReportListingDialog` (`reportProduct`).

---

## I. Inbox / chat (`Views/Chat`)

- [x] Conversation list — web: `/messages`.
- [x] Thread view + send — web: `/messages/[conversationId]`.
- [x] WebSocket realtime (JWT) — prior task completed (`useChatRoomSocket`, etc.).
- [ ] Reactions overlay (WhatsApp-style) — web: **missing** (`WhatsAppStyleReactionOverlay`).
- [ ] Order help flows in chat (`OrderHelpView`, item not received / not as described, seller order issue) — web: **missing** or stub (`ChatMessageBlock` marketplace variant may not cover all).
- [ ] Order issue detail from chat — web: **missing** (`OrderIssueDetailView`, `SellerOrderIssueDetailsView`).

---

## J. Profile tab & menu (`ProfileView`, `ProfileMenuView`, `MenuDestination`)

### J.1 Full-screen menu (`MenuView.swift`, pushed from profile)

- [ ] Lookbook (Beta) — full `LookbookView` from menu — web: **missing** dedicated lookbook experience (Discover banner only).
- [N/A] Debug menu (`DebugMenuView`, `ShopToolsView`, etc.) — consumer web not applicable.
- [N/A] Admin Dashboard from menu — web: staff console only.
- [ ] Seller dashboard (`ShopValueView`) — web: **missing** (same as “Shop value” below).
- [x] Orders — web: `/account/orders`.
- [x] Favourites — web: `/saved`.
- [x] Multi-buy discounts — web: `/account/settings/multibuy` (`userMultibuyDiscounts`, `createMultibuyDiscount`, `deactivateMultibuyDiscounts`).
- [x] Vacation mode — web: `/account/settings/vacation` (`updateProfile` `isVacationMode`).
- [ ] Invite friend — web: **missing**.
- [ ] Help Centre (`HelpCentreView`: search, FAQ list, more topics, start conversation → `HelpChatView`) — web: static `/help*` only; **no** in-app help chat / searchable FAQ parity.
- [ ] About Prelura (`AboutPreluraMenuView` → how to use + legal hub) — web: partial via footer routes; structure differs.
- [x] Logout — web: header (no confirm dialog — minor UX gap).

### J.2 Profile sheet menu (`ProfileMenuView`)

- [x] Same destinations as above (orders, favourites, multi-buy, vacation, invite, help, about, settings, logout) — web: **partial** (links on `/profile/[username]` for key items; no sheet UI).

### J.3 Core profile & shop

- [x] Own profile / shop — web: `/profile` → redirect to `/profile/[username]`.
- [x] Other user profile — web: `/profile/[username]`.
- [x] Follow / unfollow — web: `followUser` / `unfollowUser` on profile (`isFollowing` on `getUser`).
- [x] Followers list — web: `/profile/[username]/followers` (`followers` query; signed-in).
- [x] Following list — web: `/profile/[username]/following` (`following` query; signed-in).
- [x] Reviews on profile — web: `/profile/[username]/reviews` (`userReviews`).
- [ ] Profile sort sheet (listings sort) — web: **missing** (`SortSheetContent`).
- [ ] Multi-buy cart profile entry — web: **missing** (`MultiBuyCartView`).
- [ ] Shop value — web: **missing** (`ShopValueView` / `shopValue` destination).
- [x] Orders entry — web: `/account/orders` (list).
- [x] Order detail (buyer/seller) — web: `/account/orders/[orderId]` (`userOrder` query on API; timeline, line items, payments, tracking, message counterparty).
- [ ] Cancel order — web: **missing** (`CancelOrderView`).
- [ ] Refund order — web: **missing** (`RefundOrderView`).
- [x] Favourites — web: `/saved` (`FavouritesPageContent`, `LIKED_PRODUCTS`).
- [ ] Multi-buy discounts settings — web: **missing** (`MultiBuyDiscountView`).
- [ ] Vacation mode — web: **missing** (`VacationModeView`; API may exist for admin).
- [ ] Invite friend — web: **missing** (`InviteFriendView`).
- [ ] Help centre (in-app structure) — web: static `/help`, `/help/selling`, `/help/buying` (compare to `HelpChatView` tabs).
- [ ] Dashboard (seller analytics) — web: **missing** (`DashboardView`).
- [x] About / legal static pages — web: footer + `/about`, `/terms`, `/privacy`, etc. (`site-footer-nav.ts`).
- [x] Settings hub (subset) — web: `/account/settings` + vacation / multibuy / notification prefs + `/account/notifications` feed.
- [x] Logout — web: header.

---

## K. Settings subtree (`SettingsMenuView` + `Views/Settings` + `MenuDestination`)

Mirrors Swift gear menu (`ProfileMenuView.swift` → `SettingsMenuView`).

- [ ] Profile (settings row → `ProfileSettingsView`; edit profile fields) — web: partial on public profile only; **missing** dedicated settings screen.
- [ ] Account settings — web: **missing** (`AccountSettingsView`).
- [ ] Currency — web: **missing** (`CurrencySettingsView`).
- [ ] Shipping hub — web: **missing** (`ShippingMenuView`: address + postage together).
- [ ] Shipping address — web: **missing** (`ShippingAddressView`).
- [ ] Postage (under Shipping) — web: **missing** (`PostageSettingsView`).
- [ ] Appearance menu — web: **missing** (`AppearanceMenuView`).
- [ ] Payment settings (cards/bank list) — web: **missing** (`PaymentSettingsView`, `AddPaymentCardView`, `AddBankAccountView`).
- [ ] Security & privacy menu — web: **missing** (`SecurityMenuView`, `PrivacySettingsView`, `BlocklistView`).
- [ ] Identity verification — web: **missing** (`VerifyIdentityView`).
- [x] Push / email / quiet mode (high level) — web: `/account/settings/notifications` (`notificationPreference`, `updateNotificationPreference`).
- [ ] Per-topic notification matrix (likes, messages, etc.) — web: **missing** granular editors (`NotificationSettingsView` per channel).
- [ ] Invite friend (also under Settings list) — web: **missing** (duplicate entry in Swift settings section).
- [ ] Admin actions (in-app) — N/A consumer web (`AdminMenuView` → staff uses `myprelura-admin`).
- [ ] Language — web: **missing** (`LanguageMenuView`).
- [ ] Reset password (authenticated) — web: **missing** (`ResetPasswordView`).
- [ ] Email change + verification — web: **missing** (`EmailChangeVerificationView`).
- [ ] Delete account — web: **missing** (`DeleteAccountView`).
- [ ] Pause account — web: **missing** (`PauseAccountView`).
- [ ] My reports — web: **missing** (`MyReportsView`).

---

## L. Payments (`Views/Payment`)

- [ ] Payment / checkout WebView flow — web: `ProductPurchaseSection` (Stripe or redirect — audit vs `PaymentView`).
- [ ] Payment success screen — web: partial redirect/message vs `PaymentSuccessfulView`.

---

## M. Notifications (`Views/Notifications`)

- [x] In-app notifications list — web: `/account/notifications` (`notifications`, `readNotifications`).

---

## N. Menu misc (non-debug)

- [ ] Withdrawal / payout flow — web: **missing** (`WithdrawalFlowView`).
- [ ] Lookbooks upload / management — web: **missing** (`LookbooksUploadView`).
- [ ] List of contacts (social graph) — web: **missing** (`ListOfContactsView`).
- [ ] How to use Prelura — web: partial (`/how-it-works` vs `HowToUsePreluraView`).
- [ ] Legal information hub — web: split across footer pages vs `LegalInformationView` / `LegalLeafViews`.
- [x] Report user — web: `ReportProfileDialog` on other users’ profiles (`reportAccount`).

---

## O. Static / marketing pages (web routes)

- [x] About, Sustainability, Press, Advertising, Accessibility — web routes exist.
- [x] How it works, Item verification, Mobile apps, Infoboard — web routes exist.
- [x] Help centre, Selling, Buying, Trust and safety — web routes exist.
- [x] Privacy, Cookies, Terms, Our platform — web routes exist.

---

## P. Staff / debug (Swift only or `myprelura-admin`)

- [N/A] Staff app shell (`MypreluraStaffAppContent`, `StaffMainTabView`, `StaffAdminLoginView`) — web: separate `src/app/myprelura-admin/**`.
- [N/A] Admin dashboard, all orders, order issues, reports — web: staff app.
- [N/A] Debug menus (push, WebSocket, chat traces, black screens, etc.) — no consumer web equivalent.

---

## Q. Report: User profile components

- [ ] `UserProfileView` / `ProfileCardsComponentsView` card layouts — audit vs web profile page components.

---

## Completion log (optional)

_Add dated bullets when you close clusters of items._

- 2026-04-06: Favourites `/saved` wired to `LIKED_PRODUCTS`; tab “You” highlights `/saved`.
- 2026-04-06: Authored this parity checklist; initial `[x]`/`[ ]` from static code audit (not runtime QA).
- 2026-04-06: Web batch: `userOrder` API; forgot/reset password; order detail; member search; settings hub (vacation, multibuy, notif prefs); notifications feed; social lists + reviews; PDP like + report listing; profile follow + report account.
