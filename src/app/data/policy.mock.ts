import { ICreditCardPolicyGroup } from '@shared/models';

export const CREDIT_CARD_POLICIES: ICreditCardPolicyGroup[] = [
  {
    cardName: 'M&M HON Credit Card',
    number: '1234 56 04 2342 8611',
    policies: [
      {
        icon: 'flight-icon.png',
        name: 'Standard',
        status: 'Active',
        policyNumber: 'DE410000281',
        validFrom: '01/01/2024',
        actions: [
          { label: 'View policy', icon: 'eye-icon.png' },
          { label: 'File claim', icon: 'file-claim-icon.png' },
          {
            label: 'Teleconsultation appointment',
            icon: 'appointment-icon.png',
          },
        ],
      },
      {
        icon: 'flight-icon.png',
        name: 'Travel Security',
        status: 'Active',
        policyNumber: 'DE410000283',
        validFrom: '01/01/2024',
        actions: [
          { label: 'View policy', icon: 'eye-icon.png' },
          { label: 'File claim', icon: 'file-claim-icon.png' },
        ],
      },
      {
        icon: 'flight-icon.png',
        name: 'Travel Security+',
        status: 'Active',
        policyNumber: 'DE410000284',
        baseContractNumber: '214365870901',
        validFrom: '01/01/2024',
        actions: [
          { label: 'View policy', icon: 'eye-icon.png' },
          { label: 'File claim', icon: 'file-claim-icon.png' },
        ],
      },
      {
        icon: 'phone-icon.png',
        name: 'Shopping Guarantee',
        status: 'Active',
        policyNumber: 'DE410000285',
        validFrom: '01/01/2024',
        actions: [
          { label: 'View policy', icon: 'eye-icon.png' },
          { label: 'File claim', icon: 'file-claim-icon.png' },
        ],
      },
    ],
  },
];
