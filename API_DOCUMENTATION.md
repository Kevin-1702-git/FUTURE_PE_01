# API Documentation

## `GET /api/menu`

Returns the complete Feast Lane menu dataset.

## `POST /api/orders`

Creates a demo order summary.

### Request

```json
{
  "items": [
    { "id": "FL-001", "price": 219, "quantity": 2 }
  ],
  "couponDiscount": 120,
  "paymentMethod": "UPI"
}
```

## `POST /api/reservations`

Accepts reservation requests with guest details, date, and time.

## `POST /api/party-orders`

Accepts event and catering enquiries.

## `POST /api/contact`

Submits a general contact enquiry.

## `GET /api/reviews`

Returns homepage testimonials.
