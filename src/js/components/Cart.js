import {settings, select, classNames, templates} from './../settings.js';
import utils from './../utils.js';
import CartProduct from './CartProduct.js';

class Cart{
    constructor(element){
      const thisCart = this;

      // Products added to basket
      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions(element);
    } 
    getElements(element){
      const thisCart = this;

      thisCart.dom = {};

      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = element.querySelector(select.cart.productList);
      thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
      thisCart.dom.subtotalPrice = element.querySelector(select.cart.subtotalPrice);
      thisCart.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);
      thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
      thisCart.dom.form = element.querySelector(select.cart.form);
      thisCart.dom.address = element.querySelector(select.cart.address);
      thisCart.dom.phone = element.querySelector(select.cart.phone);
    }
    initActions(){
      const thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener('click', function(){
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });

      thisCart.dom.productList.addEventListener('updated', function(){
        thisCart.update();
      });

      thisCart.dom.productList.addEventListener('remove', function(event){
        thisCart.remove(event.detail.cartProduct);
      });

      thisCart.dom.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisCart.sendOrder();
      });
    }
    add(menuProduct){
      const thisCart = this;

      /* generate HTML based on template */
      const generatedHTML = templates.cartProduct(menuProduct);

      /* create element using utils.createElementFromHTML */
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);

      /* add element to menu */
      thisCart.dom.productList.appendChild(generatedDOM);


      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      
      thisCart.update();
    }
    update(){
      const thisCart = this;

      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;

      for(let product of thisCart.products){
        thisCart.totalNumber += product.amount;
        thisCart.subtotalPrice += product.price;
      }

      if (thisCart.totalNumber != 0){
      thisCart.totalPrice = thisCart.deliveryFee + thisCart.subtotalPrice;
      thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
      } else {
        thisCart.totalPrice = 0;
        thisCart.dom.deliveryFee.innerHTML = 0;
      }

      thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
      thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
      
      console.log(thisCart.dom.totalPrice);
      for (let price of thisCart.dom.totalPrice){
        price.innerHTML = thisCart.totalPrice;
      }

    }
    remove(event){
      const thisCart = this;

      event.dom.wrapper.remove();

      const productsRemove = thisCart.products.indexOf(event);
      thisCart.products.splice(productsRemove, 1);

      thisCart.update();
    }
    sendOrder(){
      const thisCart = this;

      const url = settings.db.url + '/' + settings.db.orders;

      const payload = {};
      payload.address = thisCart.dom.address.value;
      payload.phone = thisCart.dom.phone.value;
      payload.totalPrice = thisCart.totalPrice;
      payload.subtotalPrice = thisCart.subtotalPrice;
      payload.totalNumber = thisCart.totalNumber;
      payload.deliveryFee = thisCart.deliveryFee;
      payload.products = [];

      console.log('payload.address', payload.address);
      console.log('payload.phone', payload.phone);
      console.log('payload.totalPrice', payload.totalPrice);
      console.log('payload.subtotalPrice', payload.subtotalPrice);
      console.log('payload.totalNumber', payload.totalNumber);
      console.log('payload.deliveryFee', payload.deliveryFee);

      for(let prod of thisCart.products) {
        payload.products.push(prod.getData());
      }

      console.log('payload.products', payload.products);

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };
      
      fetch(url, options)
        .then(function(response){
          return response.json();
        }).then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse);
        });
    }
  }

  export default Cart;