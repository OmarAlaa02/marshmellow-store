document.getElementById('product-form').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const form = document.getElementById('product-form');
    const formData = new FormData(form);

  
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  
    const productId = document.getElementById('product-id').value;
        
        const response = await fetch(`/admin/editproduct/${productId}`, {
            method: 'POST',
            headers: {
                'X-CSRF-Token': csrfToken, 
            },
            body: formData
        });

       
        if (response.ok) {
            window.location.href = '/admin/home';
        } 
});