import { app, expect, request } from '../../../common/test-utils';
import ServerMock from '../../../common/server-mock';
import config from '../../../config';
import oAuth2Client from '../../../testdata/oauth2-client';

describe('Get profile', () => {
  config.tippiqIdBaseUrl = 'http://localhost:13001';

  const tippiqIdMockServer = new ServerMock({ port: 13001 });
  tippiqIdMockServer.app
    .get('/api/users/dummy-user-id', (req, res) => {
      res.json({
        scrambledEmail: 'mocked-email-address@example.com',
      });
    });

  beforeEach(() => tippiqIdMockServer.start());

  afterEach(() => tippiqIdMockServer.stop());

  it('should return the scrambled email address fetched from Tippiq ID', () =>
    request(app)
      .get(`/oauth2/profile/${oAuth2Client.client_id}/dummy-user-id`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body)
          .to.have.property('scrambledEmail', 'mocked-email-address@example.com');
      })
  );
});
