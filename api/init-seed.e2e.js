import { insertTestData, removeTestData } from './common/seed-utils';

before('test data', () => insertTestData());
after('test data', () => removeTestData());
