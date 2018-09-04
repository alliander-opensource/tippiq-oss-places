import { app, expect, request } from '../../../common/test-utils';

describe('Get all policy templates', () => {
  it('should include all the values', () =>
    request(app)
      .get('/policy-templates')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of.at.least(1))
      .expect(res =>
        res.body.every((policy) => { // eslint-disable-line array-callback-return
          expect(policy).to.have.property('slug');
          expect(policy).to.have.property('description');
        })
      )
  );

  it('should filter by serviceProvider', () =>
    request(app)
      .get('/policy-templates?serviceProviderId=37181aa2-560a-11e5-a1d5-c7050c4109ab')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of(0))
  );

  it('should filter by slugs', () =>
    request(app)
      .get('/policy-templates?slugs=f3p-read-energy-data')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of.at.least(1))
  );

  it('should filter by multiple slugs', () => {
    const queryParams = '?slugs=f3p-read-energy-data' +
      '&slugs=f3p-share-energy-data-neighbours';

    return request(app)
      .get(`/policy-templates${queryParams}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of.at.least(2));
  });

  it('should filter out records which don\'t match any of the specified slugs', () =>
    request(app)
      .get('/policy-templates?slugs=non-existing')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of(0))
  );
});
