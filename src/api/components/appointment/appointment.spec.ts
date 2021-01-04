import request from 'supertest';
import async from 'async';
import app from '../../../index';
import { writeFileAsync } from './service';

// treat super tests as integration tests; i.e. we don't have access to internals

describe('appointment API Tests', () => {

  let postAppointmentId = null;

  before(() => { writeFileAsync('[]')});
  
  it('should GET all appointments', (done) => {
    console.log("test __dirname", __dirname);
    request(app)
      .get('/api/appointments')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should POST appointment', (done) => {
    request(app)
      .post('/api/appointments/book')
      .send({
        doctorId: '123',
        patientName: 'Mike Smith',
        startTime: '2020-11-05T10:00:00Z"',
        endTime: '2020-11-05T11:00:00Z"'
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        postAppointmentId = res.body.appointmentId;
        console.log("postAppointmentId", postAppointmentId);
        done();
      });
  });

  it('should PUT appointment when appointmentId does not exist', (done) => {
    request(app)
      .put('/api/appointments/book')
      .send({
        appointmentId: 'abc123',
        doctorId: '123',
        patientName: 'Replaced by Winston Smith',
        startTime: '2020-11-05T10:00:00Z"',
        endTime: '2020-11-05T11:00:00Z"'
       })
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should PUT appointment when appointmentId exists', (done) => { 
    request(app)
      .put('/api/appointments/book')
      .send({
        appointmentId: 'abc123',
        doctorId: '123',
        patientName: 'Replaced by Jennifer Smith',
        startTime: '2020-11-05T10:00:00Z"',
        endTime: '2020-11-05T11:00:00Z"'
       })
      .expect(204)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should DELETE added appointments', (done) => {
    async.series([
      (cb) => {
        request(app)
          .delete('/api/appointments/abc123')
          .expect(204, cb);
      },
      (cb) => {
        request(app)
          .delete(`/api/appointments/${postAppointmentId}`)
          .expect(204, cb);
      }
    ], done)
  });
  
})

