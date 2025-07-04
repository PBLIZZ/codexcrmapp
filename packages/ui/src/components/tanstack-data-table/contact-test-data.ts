// contact-test-data.ts
  
import { Contact } from './contact-types';

export const testContacts: Contact[] = [
  {
    "id": "contact_2595",
    "firstName": "Kevin",
    "lastName": "Anderson",
    "email": "kevin.anderson@email.com",
    "phone": "+1 (230) 872-9916",
    "dateOfBirth": "1992-06-15",
    "address": "8985 Pine St, Los Angeles, NY 18554",
    "emergencyContact": "Michael Hernandez",
    "emergencyPhone": "+1 (257) 505-7430",
    "membershipType": "trial",
    "membershipStatus": "active",
    "membershipStart": "2025-03-20",
    "membershipExpiry": "2025-06-18",
    "lastSession": "2025-06-18",
    "nextSession": "2025-07-15",
    "sessionsAttended": 29,
    "sessionsCancelled": 9,
    "preferredTimes": ["5:00 PM", "10:00 AM", "7:00 PM"],
    "programs": ["Hot Yoga"],
    "tags": ["Student", "Local", "Regular", "Beginner"],
    "sessionNotes": "Client responds well to breathing exercises. Works well one-on-one.",
    "contactLog": [
      {
        "date": "2025-06-24",
        "type": "text",
        "notes": "Follow-up regarding program feedback"
      }
    ],
    "totalSpent": 190.04,
    "status": "inactive"
  }
];

export const contactStats = {
  total: 1,
  active: 0,
  inactive: 1,
  prospects: 0,
  churned: 0
};

