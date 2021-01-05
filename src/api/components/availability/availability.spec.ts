import request from 'supertest';
import app from '../../../index';
import { writeFileAsync } from './service';

describe('availability API Tests', () => {

  before(() => { writeFileAsync('[]')});
  
  it('should GET all availabilities', (done) => {
    request(app)
      .get('/api/availabilities')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  
  it('should PUT availability when doctorId does not exist', (done) => {
    request(app)
      .put('/api/availabilities')
      .send({
        "doctorId": "123456",
        "doctorName": "Banana warthogs",
        "schedule": {
            "Monday": "03:00-17:00",
            "Tuesday": "09:00-17:00",
            "Wednesday": "",
            "Thursday": "09:00-17:00",
            "Friday": "09:00-17:00",
            "Saturday": "",
            "Sunday": ""
        }
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should PUT availability when doctorId exists', (done) => {
    request(app)
      .put('/api/availabilities')
      .send({
        "doctorId": "123456",
        "doctorName": "Banana warthogs",
        "schedule": {
            "Monday": "12:00-17:00",
            "Tuesday": "09:00-17:00",
            "Wednesday": "",
            "Thursday": "09:00-17:00",
            "Friday": "09:00-17:00",
            "Saturday": "",
            "Sunday": ""
        }
       })
      .expect(204)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
})

