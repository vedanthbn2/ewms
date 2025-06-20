describe('RecyclingRequests API with Auth', () => {
  const baseUrl = '/api/recyclingRequests';

  // Mock user and receiver ids and roles
  const userId = 'user123';
  const userRole = 'user';
  const receiverId = 'receiver123';
  const receiverRole = 'receiver';

  let createdRequestId = null;

  it('POST /api/recyclingRequests - user creates a new recycling request', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      headers: {
        'x-user-id': userId,
        'x-user-role': userRole,
      },
      body: {
        userEmail: 'user@example.com',
        recycleItem: 'Laptop',
        pickupDate: '2023-06-01',
        pickupTime: '10:00 AM',
        deviceCondition: 'Good',
        status: 'Pending',
        assignedReceiver: receiverId,
        receiverEmail: 'receiver@example.com',
        receiverPhone: '1234567890',
        receiverName: 'Receiver One',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('_id');
      createdRequestId = response.body.data._id;
    });
  });

  it('GET /api/recyclingRequests - user fetches their recycling requests', () => {
    cy.request({
      method: 'GET',
      url: baseUrl,
      headers: {
        'x-user-id': userId,
        'x-user-role': userRole,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      // All requests should have userId = userId
      response.body.data.forEach((req) => {
        expect(req.userId).to.eq(userId);
      });
    });
  });

  it('PATCH /api/recyclingRequests - user updates their recycling request', () => {
    cy.request({
      method: 'PATCH',
      url: baseUrl,
      headers: {
        'x-user-id': userId,
        'x-user-role': userRole,
      },
      body: {
        id: createdRequestId,
        updates: {
          status: 'Completed',
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.status).to.eq('Completed');
    });
  });

  it('DELETE /api/recyclingRequests - user deletes their recycling requests', () => {
    cy.request({
      method: 'DELETE',
      url: baseUrl,
      headers: {
        'x-user-id': userId,
        'x-user-role': userRole,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
    });
  });

  it('POST /api/recyclingRequests - receiver creates a new recycling request (should fail)', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      headers: {
        'x-user-id': receiverId,
        'x-user-role': receiverRole,
      },
      body: {
        userId: userId,
        userEmail: 'user@example.com',
        recycleItem: 'Laptop',
        pickupDate: '2023-06-01',
        pickupTime: '10:00 AM',
        deviceCondition: 'Good',
        status: 'Pending',
        assignedReceiver: receiverId,
        receiverEmail: 'receiver@example.com',
        receiverPhone: '1234567890',
        receiverName: 'Receiver One',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(403);
      expect(response.body.success).to.be.false;
    });
  });

  it('GET /api/recyclingRequests - receiver fetches assigned recycling requests', () => {
    // First create a request assigned to receiver
    cy.request({
      method: 'POST',
      url: baseUrl,
      headers: {
        'x-user-id': userId,
        'x-user-role': userRole,
      },
      body: {
        userEmail: 'user@example.com',
        recycleItem: 'Phone',
        pickupDate: '2023-06-02',
        pickupTime: '11:00 AM',
        deviceCondition: 'Fair',
        status: 'Pending',
        assignedReceiver: receiverId,
        receiverEmail: 'receiver@example.com',
        receiverPhone: '1234567890',
        receiverName: 'Receiver One',
      },
    }).then((postResponse) => {
      expect(postResponse.status).to.eq(200);
      const requestId = postResponse.body.data._id;

      // Now receiver fetches assigned requests
      cy.request({
        method: 'GET',
        url: baseUrl,
        headers: {
          'x-user-id': receiverId,
          'x-user-role': receiverRole,
        },
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.success).to.be.true;
        expect(getResponse.body.data).to.be.an('array');
        // All requests should have assignedReceiver = receiverId
        getResponse.body.data.forEach((req) => {
          expect(req.assignedReceiver).to.eq(receiverId);
        });
      });
    });
  });
});
