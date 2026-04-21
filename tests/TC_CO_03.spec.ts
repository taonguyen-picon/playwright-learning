import { test, expect, Locator } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // Add product to the cart
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  const productCartItems = page.locator('[data-test="inventory-item"]');
  // const cartItemCount = await productCartItems.count();
  // const cartdata = [];

  // Extract and log the cart data
  // for(let i = 0 ; i < cartItemCount; i++) {
  //   const item = productCartItems.nth(i);

  //   // Extract the name, price, and quantity for each item in the cart and store it in the cartdata array
  //   cartdata.push({
  //     name: (await item.locator('[data-test="inventory-item-name"]').textContent())?.trim(),
  //     price: (await item.locator('[data-test="inventory-item-price"]').textContent())?.trim(),
  //     quantity: (await item.locator('[data-test="item-quantity"]').textContent())?.trim()
  //   });
  // }

  // Function to extract item data from a given locator
  const getItemsData = async (items : Locator) => {
  const count = await items.count();
  const data = [];

  for (let i = 0; i < count; i++) {
    const item = items.nth(i);

    data.push({
      name: (await item.locator('[data-test="inventory-item-name"]').textContent())?.trim(),
      price: (await item.locator('[data-test="inventory-item-price"]').textContent())?.trim(),
      quantity: (await item.locator('[data-test="item-quantity"]').textContent())?.trim()
    });
  }

  return data;
};

const cartdata = await getItemsData(productCartItems);


  // Proceed to checkout
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill('Mike');
  await page.locator('[data-test="lastName"]').click();
  await page.locator('[data-test="lastName"]').fill('Brown');
  await page.locator('[data-test="postalCode"]').click();
  await page.locator('[data-test="postalCode"]').fill('67890');
  await page.locator('[data-test="continue"]').click();

  const productCheckoutItems = page.locator('[data-test="inventory-item"]');

  const checkoutData = await getItemsData(productCheckoutItems);
  // const checkoutItemCount = await productCheckoutItems.count();
  // const checkoutData = [];

  // // Extract and log the checkout data
  // for (let i = 0; i < checkoutItemCount; i ++) {
  //   const item = productCheckoutItems.nth(i);

  //   // Extract the name, price, and quantity for each item in the checkout page and store it in the checkoutData array
  //   checkoutData.push({
  //     name: (await item.locator('[data-test="inventory-item-name"]').textContent())?.trim(),
  //     price: (await item.locator('[data-test="inventory-item-price"]').textContent())?.trim(),
  //     quantity: (await item.locator('[data-test="item-quantity"]').textContent())?.trim()
  //   })
  // }

  // Validate that the cart data matches the checkout data
  expect(cartdata).toEqual(checkoutData);

  // Finish the checkout process
  await page.locator('[data-test="finish"]').click();
  await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order!');
  await page.locator('[data-test="back-to-products"]').click();
});