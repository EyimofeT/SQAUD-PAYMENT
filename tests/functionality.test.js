import supertest from 'supertest';
import httpStatus from 'http-status';
import app from '../src/app';
import crypto from 'crypto'

const request = supertest(app);

let merchant_id,  base_url

describe('Merchant', () => {
  test('Create Merchant', async () => {
    const response = await request.post('/v1/merchant').send(
        {
            "name":"demo",
            "email":"tuoyo145@gmAil.com"
        }
    );

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.message).toBe('Merchant Created succesfully');
    merchant_id = response.body.data.merchant_id

  });

  test('Get Merchant', async () => {
    const response = await request.get('/v1/merchant').send()
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.message).toBe('Merchant Fetched succesfully');
  });
});

describe('Settlement', () => {
    
    base_url = '/v1/settlement/transaction/'
    let reference = crypto.randomUUID()
    let card_number = "5555 5555 5555 4444"
    let card_holder_name ="Victor Anuebunwa" 
    let card_expiration_date = "06/23"
    let card_verification_code = "373"
    let description = "Test Description"
    let currency = "NGN"
    let value = Math.floor(1000 + Math.random() * 9000)
    let bank_code = "058"
    let account_number = "5555555555"
    let account_name = "John Babawale"

    test('Create Virtual Account Transaction', async () => {  
        expect(merchant_id).toBeDefined();

        let req_body = {
            "merchant_id":merchant_id,
            "value":value,
            "description":description,
            "account_name":account_name,
            "account_number":account_number,
            "bank_code":bank_code,
            "currency":currency,
            "reference":reference
        }
        const response = await request.post(`${base_url}virtualaccount`).send(req_body);
        expect(response.status).toBe(httpStatus.OK);
      });

      test('Create Card Transaction', async () => {  
        expect(merchant_id).toBeDefined();

          let req_body = {
              "merchant_id": merchant_id,
              "value": value,
              "description":description,
              "card_number": card_number,
              "card_holder_name": card_holder_name,
              "card_expiration_date":card_expiration_date ,
              "card_verification_code":card_verification_code ,
              "currency":currency,
              "reference": reference
          }
        const response = await request.post(`${base_url}card`).send(req_body);
        expect(response.status).toBe(httpStatus.OK);
      });

      test('Update Card Transaction', async () => {  
        expect(merchant_id).toBeDefined();

          let req_body = {
            "value": value,
            "card_number": card_number,
            "currency": currency,
            "reference": reference
        }
        const response = await request.patch(`${base_url}card`).send(req_body);
        expect(response.status).toBe(httpStatus.OK);
      });


});

describe('Payment', () => {

    let base_url = `/v1/payment`
    let merchant_current_balance

    test('Fetch Payment Data Test', async () => {  
      expect(merchant_id).toBeDefined();
      const response = await request.get(`${base_url}?merchant_id=${merchant_id}`);
  
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          code: 200,
          response_code: '00',
          status: 'success',
          message: 'Payment data fetched succesfully',
          data: expect.objectContaining({
            merchant: expect.objectContaining({
              id: expect.any(Number),
              merchant_id: merchant_id,
              name: expect.any(String),
              email: expect.any(String),
              balance: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            available: expect.any(Number),
            completed_settlement: expect.any(Number),
            pending_settlement: expect.any(Number),
            total_payout: expect.any(Number),
          }),
        })
      );

      merchant_current_balance = response.body.data.available
    });


    test('Payout', async () => {  
        expect(merchant_id).toBeDefined();

          let req_body = {
            "merchant_id" : merchant_id,
            "amount": Math.floor(Math.random() * merchant_current_balance)
        }
        const response = await request.post(`${base_url}/payout`).send(req_body);
        expect(response.status).toBe(httpStatus.OK);
      });

  });
