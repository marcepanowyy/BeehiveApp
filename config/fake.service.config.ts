export const FakeServiceConfig = {
  usersInfo: {
    number: 10
  },

  categoriesInfo: {
    number: 20,
    // products number per category
    productsNumber: {
      min: 5,
      max: 30
    }
  },
  productsInfo: {
    descriptionLength: {
      minWords: 25,
      maxWords: 32,
    },
    unitsOnStock: {
      min: 0,
      max: 1000,
    },
    price: {
      min: 5,
      max: 200,
    },
  },
  ordersInfo: {
    // orders per customer
    number: {
      min: 0,
      max: 20
    },
    productsInOrder: {
      min: 1,
      max: 6,
    },
    productsQuantity: {
      min: 1,
      max: 10
    }
  }

};