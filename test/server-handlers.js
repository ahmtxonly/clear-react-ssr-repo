import { rest } from 'msw';

const handlers = [
  rest.get(
    `${__CONFIG__.API_GATEWAY}/users/authentication/details`,
    async (req, res, ctx) => {
      return res(
        ctx.json({
          userId: 38033694,
          customerId: 1,
          balance: 0,
          fullName: 'BURAK TARGAÇ',
          name: 'Burak',
          surName: 'Targaç',
          externalCustomerId: '16f3a68d-06ac-44f4-a913-b265e56a266c',
          segment: 'G5',
          isVip: false,
          isApproveLastContract: false,
          isReadLatestPolicy: true,
          mobilePhoneNumber: '5353269822',
          isOtpNeeded: false,
          email: 'btargac@gmail.com',
          hashedEmail: '7415d4257ef29de6ffaf85eac80c89ee',
          lastLoginDate: '17.11.2020 13:20',
          isCommonTicketAgreementAccepted: true,
          unreadAnnouncementsCount: 0,
        })
      );
    }
  ),
  rest.get(
    `${__CONFIG__.API_GATEWAY}/announcements/unseen-announcements-count`,
    async (req, res, ctx) => {
      return res(
        ctx.json({
          unReadNewsCount: 4,
          unseenNewsCount: 7,
        })
      );
    }
  ),
];

export default handlers;
