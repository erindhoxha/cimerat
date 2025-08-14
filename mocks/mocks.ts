import { Listing } from '@/types';

export const DATA: Listing[] = [
  {
    _id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    description: 'Banesë per qira në Dardani, i ka të gjitha pajisjet e nevojshme, 2 cimera jane qe jetojne ketu',
    price: '250',
    images: [require('../assets/images/apt.jpg')],
    city: 'Prishtina',
    createdAt: new Date(),
    neighborhood: 'Dardani',
    updatedAt: new Date(),
    user: {
      id: '1',
      password: '123',
      username: '123',
    },
  },
  {
    _id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    description: 'Banesë për qira në Dardani, i ka të gjitha pajisjet e nevojshme, 2 cimera jane qe jetojne ketu',
    price: '350',
    images: [require('../assets/images/apt2.jpg')],
    city: 'Prishtina',
    createdAt: new Date(),
    neighborhood: 'Dardani',
    updatedAt: new Date(),
    user: {
      id: '1',
      password: '123',
      username: '123',
    },
  },
  {
    _id: '58694a0f-3da1-471f-bd96-145571e29d72',
    description: 'Banesë për qira në Dardani, i ka të gjitha pajisjet e nevojshme, 2 cimera jane qe jetojne ketu',
    price: '400',
    images: [require('../assets/images/apt3.jpg')],
    city: 'Prishtina',
    createdAt: new Date(),
    neighborhood: 'Dardani',
    updatedAt: new Date(),
    user: {
      id: '1',
      password: '123',
      username: '123',
    },
  },
];
