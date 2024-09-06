function addcart(prodid, button) {
    const productDetails = button.closest('.product');
    const csrfInput = productDetails.querySelector('input[name="_csrf"]');
    const csrfToken = csrfInput.value;

    button.classList.add('clicked');
   fetch(`/cart/${prodid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken 
        },
       
    })
    .then(response => response.json())
    .then(data => {
        console.log("done")
        
        const cartCountElement = document.getElementById('cart-count');
        let cartCount = parseInt(cartCountElement.textContent, 10);
        cartCountElement.textContent = cartCount + 1;
        setTimeout(() => button.classList.remove('clicked'), 100);
       
        
    })
    
}
