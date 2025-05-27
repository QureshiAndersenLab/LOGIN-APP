import { TestBed } from '@angular/core/testing';

import { OTPService } from './otp.service';

describe('OTPService', () => {
  let service: OTPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OTPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return otp of lenght six when length not passed', (done: DoneFn) => {
    service.generateOtp().subscribe((otp) => {
      expect(otp.length).toEqual(6);
      done();
    });
  });

  it('should return correct custom lenght of otp which is passed to param', (done: DoneFn) => {
    const lenght = 10;
    service.generateOtp(lenght).subscribe((otp) => {
      expect(otp.length).toEqual(lenght);
      done();
    });
  });
});
