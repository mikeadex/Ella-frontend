import React from 'react';
import { useAuth } from '../context/AuthContext';

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: [
      'Create 1 CV',
      'Basic templates',
      'Export to PDF',
      'Email support',
    ],
    current: true,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    features: [
      'Create unlimited CVs',
      'Premium templates',
      'Export to PDF & Word',
      'Priority support',
      'AI-powered suggestions',
      'Custom branding',
    ],
    current: false,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Contact us',
    features: [
      'Everything in Pro',
      'Team management',
      'Custom templates',
      'API access',
      'Dedicated support',
      'SSO & advanced security',
    ],
    current: false,
  },
];

const Subscription = () => {
  const { user } = useAuth();

  const handleUpgrade = (planName) => {
    // TODO: Implement subscription upgrade
    console.log(`Upgrading to ${planName} plan`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Choose your plan
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          Select the perfect plan for your needs
        </p>
      </div>

      <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg shadow-sm divide-y divide-gray-200 ${
              plan.popular
                ? 'border-2 border-indigo-500'
                : 'border border-gray-200'
            }`}
          >
            <div className="p-6">
              <h3
                className="text-lg leading-6 font-medium text-gray-900 flex justify-between items-center"
              >
                {plan.name}
                {plan.popular && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Popular
                  </span>
                )}
              </h3>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-base font-medium text-gray-500">
                    {plan.period}
                  </span>
                )}
              </p>
              <button
                onClick={() => handleUpgrade(plan.name)}
                className={`mt-8 block w-full py-2 px-3 text-center rounded-md shadow ${
                  plan.popular
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                    : 'bg-white text-indigo-600 hover:bg-gray-50'
                } border border-indigo-500 font-medium`}
              >
                {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </button>
            </div>
            <div className="pt-6 pb-8 px-6">
              <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                What's included
              </h4>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
