// import { createCategory, createProduct, createUser } from './helpers';

// export const category1: any = createCategory(categoryData.categoryData1);
// export const category2: any = createCategory(categoryData.categoryData2);


// const product1: any = createProduct(productData.productData1, category1);
// const product2: any = createProduct(productData.productData2, category1);
// const product3: any = createProduct(productData.productData3, category2);
// const product4: any = createProduct(productData.productData4, category2);

export const sampleUserData = {

  userData1: {
    username: 'test1@user.com',
    password: 'tE$Tp4sSw0rd123',
  },

  userData2: {
    username: 'test2@user.com',
    password: 'tE$Tp4sSw0rd123',
  },

};

export const sampleCategoryData = {
  categoryData1: {
    name: 'testCategoryName1',
    description: 'testCategoryDescription1',
  },

  categoryData2: {
    name: 'testCategoryName2',
    description: 'testCategoryDescription2',
  },
};

export const sampleProductData = {
  productData1: {
    name: 'testProductName1',
    description: 'testProductDescription1',
    unitsOnStock: 2,
    price: 21.37,
  },

  productData2: {
    name: 'testProductName2',
    description: 'testProductDescription2',
    unitsOnStock: 23,
    price: 1,
  },

  productData3: {
    name: 'testProductName3',
    description: 'testProductDescription3',
    unitsOnStock: 0,
    price: 999,
  },

  productData4: {
    name: 'testProductName4',
    description: 'testProductDescription4',
    unitsOnStock: 999,
    price: 999,
  },
};



// const user1 = createUser(userData.userData1)
// const user2 = createUser(userData.userData2)

// const orderData = {
//   orderData1: {
//     productsArray: [
//       {
//         productId: product1.id,
//         quantity: 1,
//       },
//       {
//         productId: product2.id,
//         quantity: 3,
//       },
//     ],
//   },
//
//   orderData2:  {
//     productsArray: [
//       {
//         productId: product1.id,
//         quantity: 1,
//       },
//       {
//         productId: product2.id,
//         quantity: 1,
//       },
//       {
//         productId: product3.id,
//         quantity: 1,
//       },
//     ],
//   },
//
//   orderData3: {
//     productsArray: [
//       {
//         productId: product1.id,
//         quantity: 1,
//       },
//     ],
//   },
//
//   orderData4:  {
//     productsArray: [
//       {
//         productId: product4.id,
//         quantity: 1,
//       },
//     ],
//   }
// }

// const PartialFilterData = {
//
//   partialFilterData1: {
//     descending: true,
//     maxPrice: 40,
//   },
//
//   partialFilterData2: {
//     maxPrice: 800,
//     minPrice: 500,
//     categoryIdArr: [category1.id, category2.id]
//   },
//
//   partialFilterData3: {
//     descending: true,
//     minPrice: 950,
//     categoryIdArr: []
//   },
//
//   partialFilterData4: {
//     ascending: true,
//     minPrice: 1,
//     maxPrice: 999,
//     categoryIdArr: [category1.id, category2.id]
//   },
//
//   partialFilterData5: {
//     maxPrice: 20,
//     categoryIdArr: [category2.id]
//   }
//
// }

