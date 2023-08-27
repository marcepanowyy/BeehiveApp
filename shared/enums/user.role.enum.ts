// if method has 100 lvl of privilege it means that only superadmins and admins
// can request them (since 100 >= 100 & 1000 >= 100)

export enum UserRoleEnum {

  // narrower privileges (can see users, create admins/members/customers)
  ADMIN = 100,

  // just a member of company (can modify category/product, add category/product)
  MEMBER = 10,

  // regular customer (can place orders, see products, see themselves,
  // their orders, see categories, login/register
  CUSTOMER = 1,
}
