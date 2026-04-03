export const SETUP_TYPES = {
  'HK+Bank': {
    label: 'HK + Bank',
    steps: [
      'Order confirmed & first payment received',
      'Incorporation in progress',
      'Company documents ready',
      'Second payment received',
      'Shopify store built & website ready',
      'Bank account opened',
      'PayPal account created',
      'PayPal linked to bank account',
      'Credentials & guides delivered',
    ],
  },
  'HK+2xBanks': {
    label: 'HK + 2x Banks',
    steps: [
      'Order confirmed & first payment received',
      'Incorporation in progress',
      'Company documents ready',
      'Second payment received',
      'Shopify store built & website ready',
      'Bank account opened',
      'PayPal account created',
      'PayPal linked to bank account',
      'Second bank opened',
      'Credentials & guides delivered',
    ],
  },
  'UK+LTD': {
    label: 'UK LTD (company only)',
    steps: [
      'Order confirmed & first payment received',
      'Incorporation in progress',
      'Company documents ready',
      'Second payment received',
      'Credentials & guides delivered',
    ],
  },
  'UK+LTD+WF': {
    label: 'UK LTD + WorldFirst',
    steps: [
      'Order confirmed & first payment received',
      'Incorporation in progress',
      'Company documents ready',
      'Second payment received',
      'Bank account opened',
      'Credentials & guides delivered',
    ],
  },
  'UK+LTD+2xBanks': {
    label: 'UK LTD + 2x Banks',
    steps: [
      'Order confirmed & first payment received',
      'Incorporation in progress',
      'Company documents ready',
      'Second payment received',
      'Bank account opened',
      'Second bank opened',
      'Credentials & guides delivered',
    ],
  },
  'UK+LTD+Stripe': {
    label: 'UK LTD + Stripe',
    steps: [
      'Order confirmed & first payment received',
      'Incorporation in progress',
      'Company documents ready',
      'Second payment received',
      'Bank account opened',
      'Shopify store built & website ready',
      'Stripe account setup',
      'Credentials & guides delivered',
    ],
  },
  'UK+LTD+Stripe+2xBanks': {
    label: 'UK LTD + Stripe + 2x Banks',
    steps: [
      'Order confirmed & first payment received',
      'Incorporation in progress',
      'Company documents ready',
      'Second payment received',
      'Bank account opened',
      'Shopify store built & website ready',
      'Stripe account setup',
      'Second bank opened',
      'Credentials & guides delivered',
    ],
  },
  'US+LLC': {
    label: 'US LLC',
    steps: [
      'Order confirmed & first payment received',
      'Incorporation in progress',
      'Company documents ready',
      'Website built & ready',
      'Bank account opened',
      'Credentials & guides delivered',
    ],
  },
}

export const NOTION_LINKS = {
  onboarding: 'https://shaded-feels-b1d.notion.site/Onboarding-Checklist-32c7ce6d7346803e856dd1a363e924bd',
  proxy:      'https://shaded-feels-b1d.notion.site/Proxy-Guide-32c7ce6d73468051842ae04aac77fe4e',
  warmup:     'https://shaded-feels-b1d.notion.site/Warm-Up-SOP-32c7ce6d734680fdb648e94d69843130',
  policy:     'https://shaded-feels-b1d.notion.site/Service-Policy-32c7ce6d73468049ac0af651f2bd1759',
}

export function getSetupSteps(type) {
  return SETUP_TYPES[type]?.steps || SETUP_TYPES['HK+Bank'].steps
}

export function getSetupProgress(type, completedStepsOrCurrentStep) {
  const steps = getSetupSteps(type)
  const doneCount = Array.isArray(completedStepsOrCurrentStep)
    ? completedStepsOrCurrentStep.length
    : Math.max(0, (completedStepsOrCurrentStep || 1) - 1)
  return Math.round((doneCount / steps.length) * 100)
}
