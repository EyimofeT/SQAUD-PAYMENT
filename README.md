## SquadPayment API

      SquadPayment API is designed to facilitate seamless transactions for merchants, settlements, and payments. The API enables integration with various payment methods and settlement options while providing robust functionality for managing merchants.

## 📖 Documentation

      For detailed API usage and examples, refer to the Postman Documentation <https://documenter.getpostman.com/view/15065406/2sAYJ9Be5f>.

## 🚀 Getting Started

      Prerequisites

         Node.js (version 14 or higher)

         npm (Node Package Manager)

## Installation

      Clone the repository:

      git clone <https://github.com/EyimofeT/SQAUD-PAYMENT>

## Install dependencies:

      npm install && npx prisma generate

      Create a .env file in the root directory with the following entries:

         DATABASE_URL=""
         PORT="3000"
         VIRTUAL_ACCOUNT_TRANSACTION_RATE=0.05
         CARD_TRANSACTION_RATE=0.03

## Start the server:

      npm start

      By default, the server will run on http://localhost:3000.

## 🛠️ API Routes

      Merchant

      📝 Create Merchant

         Method: POST

         URL: http://localhost:3000/v1/merchant

         Description: Creates a new merchant.

      📜 Get Merchant

         Method: GET

         URL: http://localhost:3000/v1/merchant

         Description: Retrieves all merchants.

      Settlement

      🏦 Virtual Account Settlement

         Method: POST

         URL: http://localhost:3000/v1/settlement/transaction/virtualaccount

         Description: Initiates a settlement for a virtual account transaction.

      💳 Card Settlement

         Method: POST

         URL: http://localhost:3000/v1/settlement/transaction/card

         Description: Initiates a settlement for a card transaction.

      🔄 Update Virtual Account Settlement

         Method: PATCH

         URL: http://localhost:3000/v1/settlement/transaction/virtualaccount

         Description: Updates the status or details of a virtual account settlement.

      Payment

      💸 Payout

         Method: POST

         URL: http://localhost:3000/v1/payment/payout

         Description: Processes a payout for a payment.

      📊 Retrieve Payments

         Method: GET

         URL: http://localhost:3000/v1/payment?merchant_id={merchant_id}

         Description: Retrieves payment records for a specific merchant.

## ⚠️ Error Handling

      All API responses include appropriate HTTP status codes. For example:

      200 OK for successful requests

      400 Bad Request for validation errors

      404 Not Found for missing resources

      500 Internal Server Error for server issues

