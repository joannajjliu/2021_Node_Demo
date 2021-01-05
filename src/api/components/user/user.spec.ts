import request from 'supertest';
import app from '../../../index';
import { writeFileAsync } from './service';

describe('user API Tests', () => {

  before(() => { writeFileAsync('[]')});

  it('should POST user when userName or email does not exist', (done) => {
    request(app)
      .post('/api/users')
      .send({
        "name": "Marlot Margaret",
        "userName": "mamargee",
        "password": "mmargaretEncoded",
        "email": "mamargee@hotmail.com"
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should return error when POST userName or email already exists', (done) => {
    request(app)
      .post('/api/users')
      .send({
        "name": "Hello",
        "userName": "mamargee",
        "password": "mmargaretEncoded",
        "email": "mamargee@hotmail.com"
      })
      .expect('Content-Type', /json/)
      .expect(409)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  
})

